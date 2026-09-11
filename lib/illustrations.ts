/**
 * Maps a "Private BUILD Collection" asset id (from
 * private/brand-assets/build-collection-cards/manifest/asset-manifest.json)
 * to its public path. Files are copied verbatim from that manifest's
 * `final/*-build.png` entries into public/assets/illustrations/<id>.png -
 * never regenerated, never re-cropped here.
 */
export function illustrationSrc(id: string): string {
  return `/assets/illustrations/${id}.png`;
}
