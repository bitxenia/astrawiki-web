import { Toaster } from "react-hot-toast";
import { GoogleTagManager } from "@next/third-parties/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Footer } from "@/components/navigation/footer";
import { Settings } from "@/lib/meta";
import "./globals.css";
import HideNavbarWrapper from "@/components/navigation/hide-navbar-wrapper";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { EcosystemProvider } from "@/components/providers/ecosystem-provider";
import { StorageProvider } from "@/components/providers/storage-provider";
import { ChatStorageProvider } from "@/components/providers/chat-storage-provider";

export const metadata = {
  title: "Bitxenia",
  description: "Knowledge Repository",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <EcosystemProvider>
            <StorageProvider>
              <ChatStorageProvider>
                <HideNavbarWrapper>
                  <main className="h-auto px-5 sm:px-8">{children}</main>
                </HideNavbarWrapper>
              </ChatStorageProvider>
            </StorageProvider>
          </EcosystemProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
