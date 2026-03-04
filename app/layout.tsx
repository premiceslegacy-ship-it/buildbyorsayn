import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BUILD",
  description: "Le système complet pour construire et vendre dans le business IA.",
  metadataBase: new URL("https://buildbyorsayn.com"), // You might want to update this later to your real domain
  openGraph: {
    title: "BUILD",
    description: "Le système complet pour construire et vendre dans le business IA.",
    url: "https://buildbyorsayn.com",
    siteName: "BUILD",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "BUILD - Preview Image",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BUILD",
    description: "Le système complet pour construire et vendre dans le business IA.",
    images: ["/twitter-image.png"],
  },
  icons: {
    icon: "/opengraph-image.png",
    apple: "/opengraph-image.png",
  },
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