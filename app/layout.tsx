import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BUILD",
  description: "Système éducatif et progression",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="bg-[#0e0e0f] text-[#f0ede8] font-sans antialiased min-h-screen selection:bg-[#e8d5b0]/20 selection:text-[#e8d5b0]">
        {children}
      </body>
    </html>
  );
}
