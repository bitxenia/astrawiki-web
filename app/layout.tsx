"use client";
import { GoogleTagManager } from "@next/third-parties/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navigation/navbar";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Footer } from "@/components/navigation/footer";
import { Settings } from "@/lib/meta";
import "./globals.css";
import { useState } from "react";
import {
  ArticleContext,
  EcosystemContext,
  StorageContext,
} from "@/lib/contexts";
import { usePathname } from "next/navigation";
import NoEcosystem from "./no-ecosystem";
import { Toaster } from "react-hot-toast";
import { Storage } from "@/lib/articles/storage";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [storage, setStorage] = useState<Storage | null>(null);
  const [isESLoading, setIsESLoading] = useState<boolean>(false);
  const [esName, setESName] = useState<string>("Pick an ecosystem");
  const [article, setArticle] = useState<any>(null);

  const hideNavbarRoutes = ["/"];
  const hideNavbar = hideNavbarRoutes.includes(usePathname());

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
          <div>
            <Toaster position="bottom-center" reverseOrder={false} />
          </div>
          <EcosystemContext.Provider
            value={{
              isESLoading,
              setIsESLoading,
              esName,
              setESName,
            }}
          >
            <StorageContext.Provider value={{ storage, setStorage }}>
              <ArticleContext.Provider value={{ article, setArticle }}>
                {!hideNavbar && <Navbar />}
                <main className="h-auto px-5 sm:px-8">
                  {isESLoading && (
                    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
                      <p className="text-2xl text-white">
                        Initializing ecosystem...
                      </p>
                    </div>
                  )}
                  {(storage || hideNavbar) && children}
                  {!storage && !hideNavbar && <NoEcosystem />}
                </main>
              </ArticleContext.Provider>
            </StorageContext.Provider>
          </EcosystemContext.Provider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
