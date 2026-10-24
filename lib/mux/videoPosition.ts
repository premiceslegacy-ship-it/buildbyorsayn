import { blocIdFromDisplayLocation, type VideoDisplayLocation } from "@/lib/blocCatalog";

export type PositionedVideo = { bloc_id: string; position: number };

export function nextVideoPosition(videos: PositionedVideo[], target: VideoDisplayLocation): number {
  const blocId = blocIdFromDisplayLocation(target);
  if (!blocId) return 1;
  return Math.max(0, ...videos.filter((video) => video.bloc_id === blocId).map((video) => video.position)) + 1;
}
