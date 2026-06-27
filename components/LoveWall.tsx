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

export function LoveWall({ tweets }: LoveWallProps) {
  const half = Math.ceil(tweets.length / 2);
  const row1 = tweets.slice(0, half);
  const row2 = tweets.slice(half);

  return (
    <>
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .lovewall-left {
          animation: scrollLeft 35s linear infinite;
          transition: animation-duration 1.2s ease;
        }
        .lovewall-right {
          animation: scrollRight 35s linear infinite;
          transition: animation-duration 1.2s ease;
        }
        .lovewall-track:hover .lovewall-left,
        .lovewall-track:hover .lovewall-right {
          animation-duration: 300s;
        }
      `}</style>

      <div
        className="lovewall-track flex flex-col gap-4 overflow-hidden"
        style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
      >
        {/* Row 1 - gauche */}
        <div className="flex gap-4 lovewall-left" style={{ width: "max-content" }}>
          {[...row1, ...row1].map((tweet, i) => (
            <TweetCard key={`r1-${i}`} tweet={tweet} />
          ))}
        </div>
        {/* Row 2 - droite */}
        <div className="flex gap-4 lovewall-right" style={{ width: "max-content" }}>
          {[...row2, ...row2].map((tweet, i) => (
            <TweetCard key={`r2-${i}`} tweet={tweet} />
          ))}
        </div>
      </div>
    </>
  );
}

function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <div className="flex-shrink-0 w-64 sm:w-72 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full bg-[#e8d5b0]/20 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-[#e8d5b0]">{tweet.avatar}</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#f0ede8] truncate">{tweet.name}</p>
          <p className="text-xs text-[#8a8070] truncate">{tweet.handle}</p>
        </div>
        <svg className="w-4 h-4 text-[#8a8070] ml-auto flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.737l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
      </div>
      <p className="text-xs text-[rgba(240,237,232,0.7)] leading-relaxed">{tweet.text}</p>
    </div>
  );
}
