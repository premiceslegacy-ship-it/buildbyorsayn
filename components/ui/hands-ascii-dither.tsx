import { AsciiDitherAsset } from "@/components/ui/ascii-dither-asset";

type HandsAsciiDitherProps = {
  className?: string;
  decorative?: boolean;
};

const DITHER_ASSET_URL = "/assets/accompaniment/hands-dither-atkinson-build.png";
const CHARACTERS_ASSET_URL = "/assets/accompaniment/hands-characters-build.png";

export function HandsAsciiDither({ className, decorative = true }: HandsAsciiDitherProps) {
  return (
    <AsciiDitherAsset
      className={className}
      ditherSrc={DITHER_ASSET_URL}
      charactersSrc={CHARACTERS_ASSET_URL}
      label={decorative ? undefined : "Deux mains réalistes se rapprochent dans une trame ASCII et dither"}
    />
  );
}
