type HandsAsciiDitherProps = {
  className?: string;
  decorative?: boolean;
};

const DITHER_ASSET_URL = "/assets/accompaniment/hands-dither-atkinson-build.png";
const CHARACTERS_ASSET_URL = "/assets/accompaniment/hands-characters-build.png";

export function HandsAsciiDither({ className, decorative = true }: HandsAsciiDitherProps) {
  return (
    <div
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Deux mains réalistes se rapprochent dans une trame ASCII et dither"}
      aria-hidden={decorative}
    >
      <img
        className="guidance-ascii-layer guidance-ascii-dither"
        src={DITHER_ASSET_URL}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
      />
      <img
        className="guidance-ascii-layer guidance-ascii-characters"
        src={CHARACTERS_ASSET_URL}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
      />
      <img
        className="guidance-ascii-layer guidance-ascii-signal"
        src={CHARACTERS_ASSET_URL}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
      />
    </div>
  );
}
