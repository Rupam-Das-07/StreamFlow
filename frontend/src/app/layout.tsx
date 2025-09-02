import type { Metadata } from "next";
import { Poppins, Merriweather_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import MotionProvider from "@/components/MotionProvider";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/lib/auth-context";
import { SidebarProvider } from "@/components/sidebar-context";
import { PlaylistProvider } from "@/components/playlist-context";
import { HistoryProvider } from "@/components/history-context";
import FeatureAnnouncement from "@/components/FeatureAnnouncement";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StreamFlow",
  description: "A beautiful YouTube Music player app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${poppins.variable} ${merriweatherSans.variable} antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <SidebarProvider>
              <PlaylistProvider>
                <HistoryProvider>
                  <MotionProvider>
                    <Header />
                    <div className="flex min-h-[calc(100vh-56px)] md:flex-row">
                      <Sidebar />
                      <main className="flex-1">
                        {children}
                      </main>
                    </div>
                    <Toaster richColors closeButton />
                    <FeatureAnnouncement />
                  </MotionProvider>
                </HistoryProvider>
              </PlaylistProvider>
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
