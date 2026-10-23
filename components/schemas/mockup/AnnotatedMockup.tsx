import type { ReactNode } from "react";
import styles from "./mockup.module.css";

export type MockupBlockKind = "button" | "header" | "heading" | "image" | "offer" | "proof" | "subtitle";

export type MockupBlock = {
  kind: MockupBlockKind;
  text?: string;
  detail?: string;
};

export type MockupAnnotation = {
  number: number;
  label: string;
  x: number;
  y: number;
};

export function MockupPageBlock({ block }: { block: MockupBlock }) {
  const content: ReactNode = block.kind === "image"
    ? <><span className={styles.imageShape} /><span className={styles.imageShapeSmall} /></>
    : <>{block.text ? <strong>{block.text}</strong> : null}{block.detail ? <span>{block.detail}</span> : null}</>;
  return <div className={`${styles.block} ${styles[block.kind]}`} data-mockup-block={block.kind}>{content}</div>;
}

export function MockupFrame({ device = "browser", children }: { device?: "browser" | "phone"; children: ReactNode }) {
  return <div className={`${styles.frame} ${device === "phone" ? styles.phone : styles.browser}`} data-mockup-device={device}>
    {device === "browser"
      ? <div className={styles.browserBar} aria-hidden="true"><i /><i /><i /><span>tonsite.fr</span></div>
      : <div className={styles.phoneBar} aria-hidden="true"><span /></div>}
    <div className={styles.viewport}>{children}</div>
  </div>;
}

export function AnnotatedMockup({
  title,
  description,
  device = "browser",
  blocks,
  annotations,
}: {
  title: string;
  description: string;
  device?: "browser" | "phone";
  blocks: readonly MockupBlock[];
  annotations: readonly MockupAnnotation[];
}) {
  const titleId = `mockup-${title.toLocaleLowerCase("fr").replace(/[^a-z0-9]+/g, "-")}`;
  return <figure className={styles.figure} data-schema-container="true" data-reader-mockup="true" aria-labelledby={titleId}>
    <header className={styles.intro}><h3 id={titleId}>{title}</h3><p>{description}</p></header>
    <div className={styles.layout}>
      <div className={styles.canvas}>
        <MockupFrame device={device}><div className={styles.page}>{blocks.map((block, index) => <MockupPageBlock block={block} key={`${block.kind}-${index}`} />)}</div></MockupFrame>
        {annotations.map((annotation) => <span
          className={styles.pin}
          style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
          key={annotation.number}
          aria-hidden="true"
        >{annotation.number}</span>)}
      </div>
      <ol className={styles.legend}>{annotations.map((annotation) => <li key={annotation.number}><span>{annotation.number}</span><p>{annotation.label}</p></li>)}</ol>
    </div>
  </figure>;
}
