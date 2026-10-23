"use client";

import { createElement, useRef, useState, type ReactNode } from "react";
import { Check, Copy, Download, FileText } from "lucide-react";
import { readerVisualElement, type ReaderVisualKind } from "@/components/schemas/registry";
import { animateAppElement } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";
import { readerImageSource, readerMarkdownHref } from "./readerModel";
import {
  parseBeforeAfterPairs,
  parseDirectiveOpening,
  parseReaderDirective,
  splitExampleContent,
} from "./readerRichMarkdown";
import styles from "./reader.module.css";

type ReaderSkillFile = { slug: string; title: string; description: string };

export type ReaderProseSection = {
  content: string;
  skillFiles?: readonly ReaderSkillFile[];
};

type MarkdownOptions = {
  allowedLocalPaths?: readonly string[];
  localBaseHref?: string;
};

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

  return <div className={styles.codeBlock}><pre><code>{code}</code></pre><button ref={button} className={styles.iconButton} type="button" data-sfx="none" aria-label="Copier ce code" onClick={() => void copy()}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}</button></div>;
}

function inline(text: string, options: MarkdownOptions): ReactNode[] {
  const nodes: ReactNode[] = [];
  const tokens = /(!\[[^\]\n]*\]\([^\s)]+(?:\s+"[^"]*")?\)|\[[^\]\n]+\]\([^\s)]+\)|`[^`\n]+`|==[^=\n]+==|\*\*[^*\n]+\*\*|__[^_\n]+__|\*[^*\n]+\*|_[^_\n]+_)/g;
  let offset = 0;
  for (const match of text.matchAll(tokens)) {
    nodes.push(text.slice(offset, match.index));
    const token = match[0];
    const image = token.match(/^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)$/);
    const link = token.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
    if (image) {
      const src = readerImageSource(image[2]);
      nodes.push(src ? <span className={styles.markdownImage} key={match.index}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={image[1]} title={image[3]} loading="lazy" />
      </span> : image[1]);
    } else if (link) {
      const href = readerMarkdownHref(link[2], options);
      nodes.push(href ? <a key={match.index} href={href} rel={href.startsWith("http") ? "noreferrer noopener" : undefined}>{inline(link[1], options)}</a> : link[1]);
    } else if (token.startsWith("`")) {
      nodes.push(<code key={match.index}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("==")) {
      nodes.push(<mark className={styles.highlight} data-reader-highlight="true" key={match.index}>{inline(token.slice(2, -2), options)}</mark>);
    } else {
      const strong = token.startsWith("**") || token.startsWith("__");
      nodes.push(createElement(strong ? "strong" : "em", { key: match.index }, token.slice(strong ? 2 : 1, strong ? -2 : -1)));
    }
    offset = match.index! + token.length;
  }
  nodes.push(text.slice(offset));
  return nodes;
}

function ReaderVisual({ kind, name }: { kind: ReaderVisualKind; name: string }) {
  const visual = readerVisualElement(kind, name);
  if (!visual) return null;
  return <div className={styles.richVisual} data-reader-visual={kind} data-reader-visual-name={name}>{visual}</div>;
}

function BeforeAfterGallery({ content, options }: { content: string; options: MarkdownOptions }) {
  const pairs = parseBeforeAfterPairs(content);
  if (pairs.length === 0) return <aside className={styles.richCard} data-reader-card="avant-apres"><Markdown content={content} options={options} /></aside>;
  return <section className={styles.beforeAfterGallery} data-reader-before-after="true" aria-label="Comparaison avant et après">
    {pairs.map((pair, index) => <article className={styles.beforeAfterPair} key={`${pair.before}-${index}`}>
      <div className={styles.beforeColumn}><span>Avant</span><p><del>{inline(pair.before, options)}</del></p></div>
      <div className={styles.afterColumn}><span><Check aria-hidden="true" />Après</span><p>{inline(pair.after, options)}</p></div>
      {pair.why ? <p className={styles.whyLine}><strong>Pourquoi</strong>{inline(pair.why, options)}</p> : null}
    </article>)}
  </section>;
}

function RichDirective({ kind, title, content, options }: {
  kind: "avant-apres" | "exemple" | "retiens";
  title?: string;
  content: string;
  options: MarkdownOptions;
}) {
  if (kind === "avant-apres") return <BeforeAfterGallery content={content} options={options} />;
  if (kind === "exemple") {
    const example = splitExampleContent(content);
    return <aside className={`${styles.richCard} ${styles.exampleCard}`} data-reader-card="exemple">
      <header><span>Exemple</span><h3>{title ?? "Un cas concret"}</h3>{example.profession ? <p>{example.profession}</p> : null}</header>
      <div className={styles.richCardBody}><Markdown content={example.body} options={options} /></div>
    </aside>;
  }
  return <aside className={`${styles.richCard} ${styles.takeawayCard}`} data-reader-card="retiens">
    <h3>À retenir</h3>
    <div className={styles.richCardBody}><Markdown content={content} options={options} /></div>
  </aside>;
}

function stripFrontmatter(content: string): string {
  const normalized = content.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  if (!normalized.startsWith("---\n")) return normalized;
  const end = normalized.slice(4).search(/^(?:---|\.\.\.)\s*$/m);
  return end < 0 ? "" : normalized.slice(4 + end).replace(/^[^\n]*(?:\n|$)/, "");
}

function startsMarkdownBlock(lines: readonly string[], index: number): boolean {
  const line = lines[index] ?? "";
  if (!line.trim()) return true;
  if (parseDirectiveOpening(line) || line.trim() === ":::") return true;
  if (/^\s*\[\[(?:schema|maquette):[^\]\n]+\]\]\s*$/i.test(line)) return true;
  if (/^(?:#{1,6}\s|\s*>\s?|\s*(?:[-+*]|\d+[.)])\s|\s*(?:`{3,}|~{3,}))/.test(line)) return true;
  if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) return true;
  return /^\s*\|/.test(line) && /^\s*\|(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(lines[index + 1] || "");
}

function Markdown({ content, options }: { content: string; options: MarkdownOptions }) {
  const lines = stripFrontmatter(content).split("\n");
  const blocks: ReactNode[] = [];
  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }

    const directiveOpening = parseDirectiveOpening(line);
    if (directiveOpening) {
      const key = index;
      const directive = parseReaderDirective(lines, index);
      if (!directive) {
        index += 1;
        continue;
      }
      blocks.push(<RichDirective key={key} kind={directive.kind} title={directive.title} content={directive.content} options={options} />);
      index = directive.endIndex + 1;
      continue;
    }

    if (line.trim() === ":::") {
      index += 1;
      continue;
    }

    const visual = line.match(/^\s*\[\[(schema|maquette):([^\]\n]+)\]\]\s*$/i);
    if (visual) {
      blocks.push(<ReaderVisual kind={visual[1].toLowerCase() as ReaderVisualKind} name={visual[2].trim()} key={index} />);
      index += 1;
      continue;
    }

    const fence = line.match(/^\s*(`{3,}|~{3,})[^`]*$/);
    if (fence) {
      const key = index;
      const code: string[] = [];
      index += 1;
      const close = new RegExp(`^\\s*${fence[1][0]}{${fence[1].length},}\\s*$`);
      while (index < lines.length && !close.test(lines[index])) code.push(lines[index++]);
      if (index < lines.length) index += 1;
      blocks.push(<CodeBlock key={key} code={code.join("\n")} />);
      continue;
    }

    if (/^\s*\|/.test(line) && /^\s*\|(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(lines[index + 1] || "")) {
      const key = index;
      const cells = (row: string) => row.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
      const headers = cells(line);
      index += 2;
      const rows: ReactNode[] = [];
      while (index < lines.length && /^\s*\|/.test(lines[index])) {
        const values = cells(lines[index]);
        rows.push(<tr key={index++}>{headers.map((header, cellIndex) => <td key={header || cellIndex} data-l={header}>{inline(values[cellIndex] || "", options)}</td>)}</tr>);
      }
      blocks.push(<div className={styles.markdownTable} key={key} role="region" aria-label={`Tableau : ${headers.join(", ")}`} tabIndex={0}><table><thead><tr>{headers.map((header, cellIndex) => <th key={header || cellIndex} scope="col">{inline(header, options)}</th>)}</tr></thead><tbody>{rows}</tbody></table></div>);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if (heading) {
      blocks.push(createElement(`h${Math.min(6, heading[1].length + 1)}`, { key: index }, inline(heading[2], options)));
      index += 1;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const key = index;
      const quote: string[] = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^\s*>\s?/, ""));
      blocks.push(<blockquote key={key}>{inline(quote.join(" "), options)}</blockquote>);
      continue;
    }

    const list = line.match(/^\s*(?:([-+*])|(\d+)[.)])\s+(.+)$/);
    if (list) {
      const ordered = Boolean(list[2]);
      const key = index;
      const items: ReactNode[] = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\s*(?:([-+*])|(\d+)[.)])\s+(.+)$/);
        if (!item || Boolean(item[2]) !== ordered) break;
        items.push(<li key={index++}>{inline(item[3], options)}</li>);
      }
      blocks.push(createElement(ordered ? "ol" : "ul", { key, ...(ordered ? { start: Number(list[2]) } : {}) }, items));
      continue;
    }

    if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push(<hr key={index++} />);
      continue;
    }

    const paragraph = [line];
    const key = index++;
    while (index < lines.length && !startsMarkdownBlock(lines, index)) paragraph.push(lines[index++]);
    const paragraphText = paragraph.join(" ");
    if (/^Version pour (?:ton|l['’])IA\s*:/i.test(paragraphText)) {
      blocks.push(<aside className={styles.aiVersion} key={key}><p>{inline(paragraphText, options)}</p></aside>);
    } else {
      blocks.push(<p key={key}>{inline(paragraphText, options)}</p>);
    }
  }
  return <>{blocks}</>;
}

export function ReaderProse({ section, allowedLocalPaths, localBaseHref }: { section: ReaderProseSection; allowedLocalPaths?: readonly string[]; localBaseHref?: string }) {
  return <>
    <Markdown content={section.content} options={{ allowedLocalPaths, localBaseHref }} />
    {section.skillFiles?.map((skill) => <article className={styles.skillFile} key={skill.slug}>
      <span className={styles.skillIcon}><FileText aria-hidden="true" /></span>
      <span className={styles.skillCopy}><strong>{skill.title}</strong><span>{skill.description}</span></span>
      <a className={styles.toolButton} href={`/api/skills/${skill.slug}`}><Download aria-hidden="true" />Télécharger</a>
    </article>)}
  </>;
}
