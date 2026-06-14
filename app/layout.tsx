import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BUILD by Orsayn : Le système pour vendre dans le business IA",
  description: "La méthode pour arrêter de louer l'IA et commencer à posséder. Skills, frameworks, systèmes : du capital organique prêt à copier.",
  metadataBase: new URL("https://build-system-three.vercel.app"),
  openGraph: {
    title: "BUILD by Orsayn : Le système pour vendre dans le business IA",
    description: "La méthode pour arrêter de louer l'IA et commencer à posséder. Skills, frameworks, systèmes : du capital organique prêt à copier.",
    url: "https://buildbyorsayn.com",
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
    title: "BUILD by Orsayn : Le système pour vendre dans le business IA",
    description: "La méthode pour arrêter de louer l'IA et commencer à posséder. Skills, frameworks, systèmes : du capital organique prêt à copier.",
    images: ["/open-graph-build.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-[#0e0e0f] text-[#f0ede8] antialiased min-h-screen overflow-x-hidden w-full`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
