import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BUILD",
  description: "Le système complet pour construire et vendre dans le business IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-[#0e0e0f] text-[#f0ede8] antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}