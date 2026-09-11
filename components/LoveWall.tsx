"use client";

interface Tweet {
  handle: string;
  name: string;
  avatar: string;
  text: string;
}

interface LoveWallProps {
  tweets: Tweet[];
}

const COLUMN_COUNT = 3;
const COLUMN_DIRECTION: readonly ("up" | "down")[] = ["up", "down", "up"];
const COLUMN_DURATION = [42, 50, 38];

export function LoveWall({ tweets }: LoveWallProps) {
  const columns = Array.from({ length: COLUMN_COUNT }, (_, colIndex) =>
    tweets.filter((_, i) => i % COLUMN_COUNT === colIndex)
  );

  return (
    <>
      <style>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .lovewall-up {
          animation-name: scrollUp;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          transition: animation-duration 1.2s ease;
        }
        .lovewall-down {
          animation-name: scrollDown;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          transition: animation-duration 1.2s ease;
        }
        .lovewall-grid:hover .lovewall-up,
        .lovewall-grid:hover .lovewall-down {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="lovewall-grid grid grid-cols-2 sm:grid-cols-3 gap-4 h-[520px] overflow-hidden"
        style={{ maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)" }}
      >
        {columns.map((col, colIndex) => {
          const direction = COLUMN_DIRECTION[colIndex % COLUMN_DIRECTION.length];
          const duration = COLUMN_DURATION[colIndex % COLUMN_DURATION.length];
          return (
            <div
              key={colIndex}
              className={`flex flex-col gap-4 ${direction === "up" ? "lovewall-up" : "lovewall-down"} ${colIndex >= 2 ? "hidden sm:flex" : ""}`}
              style={{ animationDuration: `${duration}s` }}
            >
              {[...col, ...col].map((tweet, i) => (
                <TweetCard key={`${colIndex}-${i}`} tweet={tweet} />
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}

// Deterministic, varied banner + avatar treatments so the wall doesn't read
// as ten copies of the same card. Picked from a small BUILD-adjacent palette
// (gold, warm neutrals, one blue nod to X) rather than randomized per render.
const BANNERS = [
  "bg-[radial-gradient(120%_180%_at_0%_0%,#f0dfc0_0%,#e8d5b0_45%,#c9925a_100%)]",
  "bg-gradient-to-br from-[#1d9bf0] to-[#0e0e0f]",
  "bg-[conic-gradient(from_180deg_at_50%_120%,#e8d5b0,#8a5a3a,#0e0e0f,#e8d5b0)]",
  "bg-gradient-to-tr from-[#0e0e0f] via-[#3a2f22] to-[#e8d5b0]",
  "bg-[radial-gradient(120%_150%_at_100%_0%,#7cc4f5_0%,#1d5a8f_55%,#0e0e0f_100%)]",
] as const;

const AVATAR_STYLES = [
  "bg-[#e8d5b0] text-[#0e0e0f]",
  "bg-[#0f1419] text-[#e8d5b0]",
  "bg-[#1d9bf0] text-white",
  "bg-gradient-to-br from-[#f0dfc0] to-[#c9925a] text-[#0e0e0f]",
  "bg-gradient-to-br from-[#3a2f22] to-[#0e0e0f] text-[#e8d5b0]",
] as const;

function paletteIndex(seed: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash % length;
}

function TweetCard({ tweet }: { tweet: Tweet }) {
  const banner = BANNERS[paletteIndex(tweet.handle, BANNERS.length)];
  const avatarStyle = AVATAR_STYLES[paletteIndex(tweet.handle + tweet.name, AVATAR_STYLES.length)];

  return (
    <div className="w-full shrink-0 rounded-2xl bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      <div className={`h-12 ${banner}`} />
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-6 mb-2.5">
          <div className={`w-12 h-12 rounded-full border-[3px] border-white flex items-center justify-center flex-shrink-0 ${avatarStyle}`}>
            <span className="text-sm font-bold">{tweet.avatar}</span>
          </div>
          <span className="mt-6 rounded-full bg-[#0f1419] px-3.5 py-1 text-[13px] font-bold text-white">
            Suivre
          </span>
        </div>

        <div className="flex items-center gap-1">
          <p className="text-[15px] font-bold text-[#0f1419] truncate">{tweet.name}</p>
          <svg className="w-[16px] h-[16px] text-[#1d9bf0] flex-shrink-0" viewBox="0 0 22 22" fill="currentColor">
            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.85-1.245 1.44c-.607-.224-1.264-.272-1.897-.14-.634.13-1.218.436-1.687.882-.446.47-.752 1.053-.883 1.687-.13.633-.083 1.29.14 1.897-.586.274-1.084.705-1.438 1.246-.354.54-.551 1.17-.569 1.816.018.646.215 1.275.57 1.816.354.54.852.972 1.438 1.246-.223.607-.27 1.264-.14 1.897.131.634.437 1.218.882 1.687.47.446 1.053.75 1.687.883.633.13 1.29.083 1.897-.14.274.586.705 1.084 1.246 1.438.54.354 1.17.551 1.816.569.646-.018 1.273-.213 1.813-.568s.969-.85 1.245-1.44c.607.224 1.264.272 1.897.14.634-.13 1.218-.436 1.687-.882.446-.47.752-1.053.883-1.687.13-.633.083-1.29-.14-1.897.586-.274 1.084-.705 1.438-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.293 2.136 2.136 4.44-4.44 1.293 1.293-5.733 5.732z" />
          </svg>
        </div>
        <p className="text-[13px] text-[#536471] mb-3">{tweet.handle}</p>

        <p className="text-[13px] text-[#0f1419] leading-relaxed">{tweet.text}</p>
      </div>
    </div>
  );
}
