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
import { useState } from "react";
import { Ecosystem } from "@/lib/ecosystems/ecosystem";
import ExampleServer from "@/lib/ecosystems/example-server";
import {
    ArticleContext,
    EcosystemContext,
    RawArticleContext,
} from "@/lib/contexts";
import { usePathname } from "next/navigation";
import { BarLoader } from "react-spinners";

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
    const [ecosystem, setEcosystem] = useState<Ecosystem | null>(null);
    const [isESLoading, setIsESLoading] = useState<boolean>(false);
    const [article, setArticle] = useState<any>(null);
    const [rawArticle, setRawArticle] = useState<any>(null);

    const hideNavbarRoutes = ["/"];
    const hideNavbar = hideNavbarRoutes.includes(usePathname());

    return (
        <html lang="en" suppressHydrationWarning>
            {Settings.gtmconnected && (
                <GoogleTagManager gtmId={Settings.gtm} />
            )}
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
                    <EcosystemContext.Provider value={{ ecosystem, setEcosystem, isESLoading, setIsESLoading }}>
                        <ArticleContext.Provider value={{ article, setArticle }}>
                            {!hideNavbar && <Navbar />}
                            <main className="px-5 sm:px-8 h-auto">
                                {isESLoading && (
                                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <p className="text-white text-2xl">Initializing ecosystem...</p>
                                    </div>
                                )}
                                {(ecosystem || hideNavbar) && children}
                                {!ecosystem && !hideNavbar && (
                                    <p>
                                        Please choose an ecosystem
                                    </p>
                                )}
                            </main>
                        </ArticleContext.Provider>
                    </EcosystemContext.Provider>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
