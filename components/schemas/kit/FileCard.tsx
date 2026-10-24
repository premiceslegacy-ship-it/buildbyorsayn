import { Fragment } from "react";
import { KitFrame } from "./KitFrame";
import { ToolMark } from "./ToolMark";
import type { KitBaseProps } from "./types";
import styles from "./kit.module.css";

export type FileLine = {
  text: string;
  tone?: "heading" | "muted" | "normal";
};

export type FileAnnotation = {
  line: number;
  label: string;
};

export type FileCardProps = KitBaseProps & {
  filename: "SOUL.md" | "SKILL.md" | string;
  lines: readonly FileLine[];
  annotations: readonly FileAnnotation[];
  tool?: string;
};

function renderFileText(text: string) {
  const parts = text.split("/");
  const isUrl = text.includes("://");
  return parts.map((part, index) => <Fragment key={`${part}-${index}`}>{index > 0 ? "/" : null}<span className={isUrl ? styles.fileNoBreak : undefined}>{part}</span>{index < parts.length - 1 ? <wbr /> : null}</Fragment>);
}

export function FileCard({ filename, lines, annotations, tool, ...frame }: FileCardProps) {
  const annotationsByLine = new Map(annotations.map((annotation, index) => [annotation.line, { annotation, number: index + 1 }]));
  return <KitFrame {...frame} kind="file-card" keys={annotations.length ? [{ swatch: "accent", label: "Chaque pastille renvoie à la ligne surlignée" }] : undefined}>
    <div className={styles.fileLayout}>
      <section className={styles.editor}>
        <header><span>{filename}</span>{tool ? <ToolMark name={tool} size={28} /> : null}</header>
        <ol className={styles.fileGrid}>{lines.map((line, index) => {
          const lineNumber = index + 1;
          const note = annotationsByLine.get(lineNumber);
          const tone = line.tone === "heading" ? styles.fileHeading : line.tone === "muted" ? styles.fileMuted : "";
          return <li className={`${styles.fileRow} ${tone} ${note ? styles.fileNoted : ""}`.trim()} key={`${line.text}-${lineNumber}`}>
            <div className={styles.fileCode}><span>{lineNumber}</span><code>{renderFileText(line.text || " ")}</code></div>
            {note
              ? <div className={styles.fileNote}><span>{note.number}</span><p>{note.annotation.label}</p></div>
              : <span className={styles.fileNoteSpacer} aria-hidden="true" />}
          </li>;
        })}</ol>
      </section>
    </div>
  </KitFrame>;
}
