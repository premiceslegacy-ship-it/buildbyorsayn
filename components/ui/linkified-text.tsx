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
                            className="relative z-20 text-accent underline underline-offset-2 transition-colors hover:text-[#b9f5cf]"
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
