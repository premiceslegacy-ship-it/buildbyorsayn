"use client";

import { useRef, useState } from "react";
import { Check, Copy, Download, FileText } from "lucide-react";
import { LinkifiedText } from "@/components/ui/linkified-text";
import type { BlocSection } from "@/lib/blocCatalog";
import { animateAppElement } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";
import styles from "./reader.module.css";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      void playAppSound("confirm");
      if (button.current) animateAppElement(button.current, [{ transform: "scale(.9)" }, { transform: "scale(1)" }], "rebond");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      void playAppSound("error");
      if (button.current) animateAppElement(button.current, [
        { transform: "translateX(0)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(0)" },
      ], "vif");
    }
  };

  return <div className={styles.codeBlock}><pre>{code}</pre><button ref={button} className={styles.iconButton} type="button" data-sfx="none" aria-label="Copier ce code" onClick={() => void copy()}>{copied ? <Check /> : <Copy />}</button></div>;
}

function TextSegment({ segment, segmentIndex }: { segment: string; segmentIndex: number }) {
  return <>{segment.trim().split("\n\n").filter(Boolean).map((paragraph, paragraphIndex) => {
    const key = `${segmentIndex}-${paragraphIndex}`;
    if (paragraph.startsWith("## ")) return <h3 key={key}><LinkifiedText text={paragraph.slice(3)} /></h3>;

    const lines = paragraph.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length > 0 && lines.every((line) => line.startsWith("- "))) {
      return <ul key={key}>{lines.map((line, lineIndex) => <li key={`${key}-${lineIndex}`}><LinkifiedText text={line.slice(2)} /></li>)}</ul>;
    }
    if (lines.length > 0 && lines.every((line) => /^\d+\)\s/.test(line))) {
      return <ol key={key}>{lines.map((line, lineIndex) => <li key={`${key}-${lineIndex}`}><LinkifiedText text={line.replace(/^\d+\)\s/, "")} /></li>)}</ol>;
    }
    return <p key={key}><LinkifiedText text={paragraph} /></p>;
  })}</>;
}

export function ReaderProse({ section }: { section: BlocSection }) {
  const segments = section.content.split(/(```[\s\S]*?```)/g);
  return <>
    {segments.map((segment, index) => {
      if (segment.startsWith("```") && segment.endsWith("```")) {
        const inner = segment.slice(3, -3);
        const firstNewline = inner.indexOf("\n");
        const code = firstNewline === -1 ? inner.trim() : inner.slice(firstNewline + 1).trim();
        return <CodeBlock key={index} code={code} />;
      }
      return <TextSegment key={index} segment={segment} segmentIndex={index} />;
    })}
    {section.skillFiles?.map((skill) => <article className={styles.skillFile} key={skill.slug}>
      <span className={styles.skillIcon}><FileText aria-hidden="true" /></span>
      <span className={styles.skillCopy}><strong>{skill.title}</strong><span>{skill.description}</span></span>
      <a className={styles.toolButton} href={`/api/skills/${skill.slug}`}><Download aria-hidden="true" />Télécharger</a>
    </article>)}
  </>;
}
