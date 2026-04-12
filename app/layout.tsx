import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BUILD",
  description: "Le système complet pour construire et vendre dans le business IA.",
  metadataBase: new URL("https://buildbyorsayn.com"),
  openGraph: {
    title: "BUILD",
    description: "Le système complet pour construire et vendre dans le business IA.",
    url: "https://buildbyorsayn.com",
    siteName: "BUILD",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BUILD",
    description: "Le système complet pour construire et vendre dans le business IA.",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
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