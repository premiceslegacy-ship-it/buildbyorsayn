import { Diagram, Edge, Node } from "./primitives";

export type FlowItem = {
  label: string;
  sub?: string;
  num?: string;
  accent?: boolean;
  tone?: "default" | "muted" | "hollow";
};

export function FlowDiagram({ id, title, says, caption, description, items, compactGap = 32 }: {
  id: string;
  title: string;
  says: string;
  caption?: string;
  description?: string;
  items: readonly FlowItem[];
  compactGap?: 24 | 32 | 40;
}) {
  if (items.length > 4) return <StackDiagram id={id} title={title} says={says} caption={caption} description={description} items={items} />;
  const wideGap = 24;
  const wideWidth = Math.floor((680 - wideGap * (items.length - 1)) / items.length / 8) * 8;
  const wideRemainder = 680 - (wideWidth * items.length + wideGap * (items.length - 1));
  const wideX = wideRemainder / 2;
  const wideHeight = 128;
  const compactWidth = 272;
  const compactX = 0;
  const compactNodeHeight = 112;
  const compactHeight = items.length * compactNodeHeight + (items.length - 1) * compactGap;
  const desc = description ?? items.map((item) => `${item.num ? `${item.num} ` : ""}${item.label}${item.sub ? `, ${item.sub}` : ""}`).join(" ; ");

  return <Diagram
    id={id}
    title={title}
    says={says}
    caption={caption}
    description={desc}
    wideHeight={wideHeight}
    compactHeight={compactHeight}
    wide={<>{items.map((item, index) => {
      const x = wideX + index * (wideWidth + wideGap);
      return <g key={`${item.label}-${index}`}>
        <Node {...item} x={x} y={0} w={wideWidth} h={wideHeight} step={index} />
        {index < items.length - 1 ? <Edge points={[[x + wideWidth, wideHeight / 2], [x + wideWidth + wideGap, wideHeight / 2]]} step={index} /> : null}
      </g>;
    })}</>}
    compact={<>{items.map((item, index) => {
      const y = index * (compactNodeHeight + compactGap);
      return <g key={`${item.label}-${index}`}>
        <Node {...item} x={compactX} y={y} w={compactWidth} h={compactNodeHeight} align="start" inline step={index} />
        {index < items.length - 1 ? <Edge points={[[compactX + compactWidth / 2, y + compactNodeHeight], [compactX + compactWidth / 2, y + compactNodeHeight + compactGap]]} step={index} /> : null}
      </g>;
    })}</>}
  />;
}

function StackDiagram({ id, title, says, caption, description, items }: {
  id: string;
  title: string;
  says: string;
  caption?: string;
  description?: string;
  items: readonly FlowItem[];
}) {
  const wideNodeHeight = 72;
  const wideGap = 24;
  const compactNodeHeight = 88;
  const compactGap = 24;
  const wideHeight = items.length * wideNodeHeight + (items.length - 1) * wideGap;
  const compactHeight = items.length * compactNodeHeight + (items.length - 1) * compactGap;
  const desc = description ?? items.map((item) => `${item.num ? `${item.num} ` : ""}${item.label}${item.sub ? `, ${item.sub}` : ""}`).join(" ; ");
  return <Diagram
    id={id}
    title={title}
    says={says}
    caption={caption}
    description={desc}
    wideHeight={wideHeight}
    compactHeight={compactHeight}
    wide={<>{items.map((item, index) => {
      const y = index * (wideNodeHeight + wideGap);
      return <g key={`${item.label}-${index}`}>
        <Node {...item} x={40} y={y} w={600} h={wideNodeHeight} align="start" inline step={index} />
        {index < items.length - 1 ? <Edge points={[[340, y + wideNodeHeight], [340, y + wideNodeHeight + wideGap]]} step={index} /> : null}
      </g>;
    })}</>}
    compact={<>{items.map((item, index) => {
      const y = index * (compactNodeHeight + compactGap);
      return <g key={`${item.label}-${index}`}>
        <Node {...item} x={0} y={y} w={272} h={compactNodeHeight} align="start" inline step={index} />
        {index < items.length - 1 ? <Edge points={[[136, y + compactNodeHeight], [136, y + compactNodeHeight + compactGap]]} step={index} /> : null}
      </g>;
    })}</>}
  />;
}
