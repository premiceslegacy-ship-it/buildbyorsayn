import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0e0e0f",
          secondary: "#161618",
          tertiary: "#1c1c1f",
        },
        accent: {
          DEFAULT: "#e8d5b0",
          dark: "#c9b48a",
        },
        text: {
          DEFAULT: "#f0ede8",
          secondary: "rgba(240, 237, 232, 0.50)",
          tertiary: "rgba(240, 237, 232, 0.25)",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.07)",
          active: "rgba(232, 213, 176, 0.20)",
          hover: "rgba(255, 255, 255, 0.12)",
        },
        success: "rgba(74, 222, 128, 0.80)",
        error: "rgba(248, 113, 113, 0.80)",
        warning: "rgba(251, 191, 36, 0.80)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(232, 213, 176, 0.15)",
      },
      keyframes: {
        appleSplash: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "20%": { opacity: "1", transform: "scale(1)" },
          "80%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(1.05)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "apple-splash": "appleSplash 3s ease-in-out forwards",
        "fade-in": "fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        ".liquid-glass": {
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
          borderRadius: "20px",
        },
      });
    },
  ],
};

export default config;
