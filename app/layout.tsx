import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

const SITE_TITLE = "Construire, vendre et livrer avec l'IA | BUILD by Orsayn";
const SITE_DESCRIPTION = "BUILD t'aide à passer d'idées et d'outils dispersés à une offre claire, un livrable montrable et une méthode réutilisable.";
const SITE_URL = "https://buildbyorsayn.com";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "BUILD",
    images: [
      {
        url: "/open-graph-build.png",
        width: 1200,
        height: 630,
        alt: "BUILD by Orsayn",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/open-graph-build.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" data-scroll-behavior="smooth">
      <body className={`${inter.className} bg-[#0e0e0f] text-[#f0ede8] antialiased min-h-screen w-full`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
