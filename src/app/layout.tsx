import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/lib/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  icons: {
    icon: { url: "/icons/adapenyu-browser-v3.png", type: "image/png", sizes: "64x64" },
    shortcut: "/icons/adapenyu-browser-v3.png",
    apple: { url: "/icons/adapenyu-touch-v3.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased motion-safe:scroll-smooth`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <a className="absolute -top-40 left-4 z-100 bg-background p-3 focus:top-4 focus-visible:outline-solid focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
