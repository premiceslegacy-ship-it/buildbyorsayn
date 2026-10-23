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

export function FileCard({ filename, lines, annotations, tool, ...frame }: FileCardProps) {
  const notesByLine = new Map(annotations.map((annotation, index) => [annotation.line, index + 1]));
  return <KitFrame {...frame} kind="file-card">
    <div className={styles.fileLayout}>
      <section className={styles.editor}>
        <header><span>{filename}</span>{tool ? <ToolMark name={tool} size={28} /> : null}</header>
        <ol>{lines.map((line, index) => {
          const lineNumber = index + 1;
          const noteNumber = notesByLine.get(lineNumber);
          return <li className={line.tone === "heading" ? styles.fileHeading : line.tone === "muted" ? styles.fileMuted : undefined} key={`${line.text}-${lineNumber}`}>
            <span>{lineNumber}</span><code>{line.text || " "}</code>{noteNumber ? <b>{noteNumber}</b> : null}
          </li>;
        })}</ol>
      </section>
      <ol className={styles.fileNotes}>{annotations.map((annotation, index) => <li
        style={{ "--kit-note-line": annotation.line } as React.CSSProperties}
        key={`${annotation.line}-${annotation.label}`}
      ><span>{index + 1}</span><p>{annotation.label}</p></li>)}</ol>
    </div>
  </KitFrame>;
}
