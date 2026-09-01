type AsciiDitherAssetProps = {
  ditherSrc: string;
  charactersSrc: string;
  className?: string;
  label?: string;
  animated?: boolean;
};

export function AsciiDitherAsset({ ditherSrc, charactersSrc, className, label, animated = true }: AsciiDitherAssetProps) {
  const decorative = !label;
  return (
    <div
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative}
    >
      <img
        className="guidance-ascii-layer guidance-ascii-dither"
        src={ditherSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
      />
      <img
        className="guidance-ascii-layer guidance-ascii-characters"
        src={charactersSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
      />
      {animated && (
        <img
          className="guidance-ascii-layer guidance-ascii-signal"
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
