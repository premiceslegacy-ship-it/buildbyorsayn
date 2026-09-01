type AsciiDitherAssetProps = {
  ditherSrc: string;
  charactersSrc: string;
  className?: string;
  label?: string;
  animated?: boolean;
  fit?: "contain" | "cover";
};

export function AsciiDitherAsset({ ditherSrc, charactersSrc, className, label, animated = true, fit = "contain" }: AsciiDitherAssetProps) {
  const decorative = !label;
  const fitStyle = fit === "cover" ? { objectFit: "cover" as const } : undefined;
  return (
    <div
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative}
    >
      <img
        className="guidance-ascii-layer guidance-ascii-dither"
        style={fitStyle}
        src={ditherSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
      />
      <img
        className="guidance-ascii-layer guidance-ascii-characters"
        style={fitStyle}
        src={charactersSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
      />
      {animated && (
        <img
          className="guidance-ascii-layer guidance-ascii-signal"
          style={fitStyle}
          src={charactersSrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          decoding="async"
        />
      )}
    </div>
  );
}
