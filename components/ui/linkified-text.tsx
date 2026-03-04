import React from 'react';

export function LinkifiedText({ text }: { text: string }) {
    if (!text) return null;

    // Expression régulière robuste pour détecter http://, https:// et www.
    // en ignorant la ponctuation finale (point, virgule, parenthèse fermante, etc.)
    const urlRegex = /((?:https?:\/\/|www\.)[^\s<]+[^<.,:;"')\]\s])/g;
    const parts = text.split(urlRegex);

    return (
        <>
            {parts.map((part, i) => {
                if (part.match(urlRegex)) {
                    const href = part.startsWith('www.') ? `https://${part}` : part;
                    return (
                        <a
                            key={i}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#e8d5b0] hover:text-[#f0dfc0] underline underline-offset-2 transition-colors drop-shadow-[0_0_8px_rgba(232,213,176,0.3)] relative z-20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {part}
                        </a>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}
