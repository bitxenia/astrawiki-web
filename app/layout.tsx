"use client";
// import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navigation/navbar";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Footer } from "@/components/navigation/footer";
import { Settings } from "@/lib/meta";
import "./globals.css";
import { useContext, useState } from "react";
import { Ecosystem } from "@/lib/ecosystems/ecosystem";
import { ArticleContext, EcosystemContext } from "@/lib/contexts";

// const baseUrl = Settings.metadataBase;

// export const metadata: Metadata = {
//     title: Settings.title,
//     metadataBase: new URL(baseUrl),
//     description: Settings.description,
//     keywords: Settings.keywords,
//     openGraph: {
//         type: Settings.openGraph.type,
//         url: baseUrl,
//         title: Settings.openGraph.title,
//         description: Settings.openGraph.description,
//         siteName: Settings.openGraph.siteName,
//         images: Settings.openGraph.images.map((image) => ({
//             ...image,
//             url: `${baseUrl}${image.url}`,
//         })),
//     },
//     twitter: {
//         card: Settings.twitter.card,
//         title: Settings.twitter.title,
//         description: Settings.twitter.description,
//         site: Settings.twitter.site,
//         images: Settings.twitter.images.map((image) => ({
//             ...image,
//             url: `${baseUrl}${image.url}`,
//         })),
//     },
//     alternates: {
//         canonical: baseUrl,
//     },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ecosystem = useContext<Ecosystem>(EcosystemContext);
  const [article, setArticle] = useState<any>(null);

  return (
    <html lang="en" suppressHydrationWarning>
      {Settings.gtmconnected && <GoogleTagManager gtmId={Settings.gtm} />}
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-regular`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <EcosystemContext.Provider value={ecosystem}>
            <ArticleContext.Provider value={{ article, setArticle }}>
              <Navbar />
              <main className="px-5 sm:px-8 h-auto">{children}</main>
            </ArticleContext.Provider>
          </EcosystemContext.Provider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
