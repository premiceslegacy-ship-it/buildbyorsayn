import { HTMLAttributes } from "react";

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  layout?: "horizontal" | "vertical";
  hideText?: boolean;
  animated?: boolean;
}

export function Logo({ 
  layout = "vertical", 
  hideText = false, 
  animated = false,
  className = "", 
  ...props 
}: LogoProps) {
  const isVertical = layout === "vertical";

  return (
    <div 
      className={`inline-flex items-center ${
        isVertical 
          ? "flex-col justify-center gap-6" 
          : "flex-row gap-4"
      } ${className}`} 
      {...props}
    >
      {/* Élément 1 : La Marque (Le symbole SVG cubique) */}
      <div className={`${isVertical ? "w-12 h-12" : "w-8 h-8"} flex-shrink-0 ${animated ? 'opacity-0 animate-fade-up' : ''}`}>
        <svg 
          className="w-full h-full" 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(0, 55)">
            <path fill="#e8d5b0" d="M50 25 L100 0 L150 25 L100 50 Z"></path>
            <path fill="#30261c" d="M50 25 L100 50 V110 L50 85 Z"></path>
            <path fill="#c9b48a" d="M150 25 L100 50 V110 L150 85 Z"></path>
          </g>
          <g transform="translate(10, 80)">
            <path fill="#e8d5b0" d="M0 25 L45 2.5 L90 25 L45 47.5 Z"></path> 
            <path fill="#30261c" d="M0 25 L45 47.5 V100 L0 77.5 Z"></path> 
            <path fill="#c9b48a" d="M90 25 L45 47.5 V100 L90 77.5 Z"></path> 
          </g>
          <g transform="translate(55, 57)">
            <path fill="#e8d5b0" d="M0 25 L45 2.5 L90 25 L45 47.5 Z"></path>
            <path fill="#30261c" d="M0 25 L45 47.5 V100 L0 77.5 Z"></path>
            <path fill="#c9b48a" d="M90 25 L45 47.5 V100 L90 77.5 Z"></path> 
          </g>
          <g transform="translate(100, 34)">
            <path fill="#e8d5b0" d="M0 25 L45 2.5 L90 25 L45 47.5 Z"></path>
            <path fill="#30261c" d="M0 25 L45 47.5 V100 L0 77.5 Z"></path>
            <path fill="#c9b48a" d="M90 25 L45 47.5 V100 L90 77.5 Z"></path>
          </g>
        </svg>
      </div>

      {/* Élément 2 : Le Texte (Vrai texte HTML) */}
      {!hideText && (
        <span 
          className={`font-extrabold uppercase text-[#f0ede8] leading-none ${
            isVertical 
              ? "text-[48px] tracking-[7.2px]" 
              : "text-[24px] tracking-[3.6px]"
          } ${animated ? 'opacity-0 animate-fade-up [animation-delay:200ms]' : ''}`}
        >
          BUILD
        </span>
      )}
    </div>
  );
}
