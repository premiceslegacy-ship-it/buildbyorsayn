"use client";

import Image from "next/image";
import Link from "next/link";

type StateAction = { label: string; href: string; onClick?: never } | { label: string; onClick: () => void; href?: never };

export function AppState({
  title,
  detail,
  action,
  secondary,
  object = "bloc",
  compact = false,
  tone = "status",
  testId,
  headingLevel = 1,
}: {
  title: string;
  detail: string;
  action?: StateAction;
  secondary?: { label: string; href: string };
  object?: "bloc" | "livraison" | "offre" | "vente";
  compact?: boolean;
  tone?: "status" | "alert";
  testId?: string;
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h1";
  const renderAction = (value: StateAction) => "href" in value
    ? <Link className="btn btn--p" href={value.href}>{value.label}</Link>
    : <button className="btn btn--p" type="button" onClick={value.onClick}>{value.label}</button>;

  return (
    <section className={compact ? "grid place-items-center px-5 py-10 text-center" : "grid min-h-[66svh] place-items-center px-[var(--gutter,20px)] pb-[110px] pt-[clamp(96px,12vw,150px)] text-center"} role={tone} data-testid={testId}>
      <div className="grid w-full max-w-[38rem] justify-items-center gap-[14px]">
        <Image className={compact ? "mb-1 h-auto w-24 drop-shadow-[0_24px_46px_rgba(0,0,0,.38)]" : "mb-1 h-auto w-[clamp(112px,18vw,176px)] drop-shadow-[0_24px_46px_rgba(0,0,0,.38)]"} src={`/da/objets/${object}.png`} alt="" width={256} height={256} aria-hidden="true" />
        <Heading className={compact ? "m-0 text-balance font-[var(--font-t,system-ui)] text-2xl font-bold leading-[1.1] tracking-[-.03em] text-[var(--encre,#f1f5f2)]" : "m-0 text-balance font-[var(--font-t,system-ui)] text-[clamp(28px,4vw,42px)] font-bold leading-[1.1] tracking-[-.03em] text-[var(--encre,#f1f5f2)]"}>{title}</Heading>
        <p className="m-0 max-w-[34rem] text-pretty font-[var(--font,system-ui)] text-[17px] leading-[1.48] text-[var(--t2,rgba(241,245,242,.7))]">{detail}</p>
        {action || secondary ? <div className="mt-[14px] flex flex-wrap justify-center gap-x-4 gap-y-[10px]">{action ? renderAction(action) : null}{secondary ? <Link className="btn btn--l app-state-secondary" href={secondary.href}>{secondary.label}</Link> : null}</div> : null}
      </div>
    </section>
  );
}
