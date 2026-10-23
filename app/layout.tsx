import type { Metadata } from "next";
import { connection } from "next/server";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { getSiteOrigin } from "@/lib/siteOrigin";

// preload:false : les pages publiques (accueil, offres, légales) utilisent General Sans et Geist (da.css) ; Inter n'y est plus préchargé. Il se charge quand une page l'utilise.
const inter = Inter({ subsets: ["latin"], preload: false });

const SITE_TITLE = "Construire, vendre et livrer avec l'IA | BUILD by Orsayn";
const SITE_DESCRIPTION = "BUILD t'aide à passer d'idées et d'outils dispersés à une offre claire, un livrable montrable et une méthode réutilisable.";
// The host that really serves the app (Vercel sets it per environment); localhost when unset in dev.
const SITE_URL = getSiteOrigin();

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

// Rendu à la demande : le nonce de la CSP (proxy.ts) ne peut pas être gravé dans du HTML prérendu.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  return (
    <html lang="fr" className="dark" data-scroll-behavior="smooth">
      <body className={`${inter.className} min-h-screen w-full antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
