import type { Metadata } from "next";
import { LandingPage } from "@/features/marketing/landing-page";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "AdaPenyu — Every turtle’s story starts with recognition",
  description: "AdaPenyu helps identify individual sea turtles through their unique facial patterns.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AdaPenyu — Every turtle’s story starts with recognition",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    images: [{ url: "/og-preview.png", width: 1440, height: 900, alt: "AdaPenyu website introducing turtle photo identification" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AdaPenyu — Every turtle’s story starts with recognition",
    description: siteConfig.description,
    images: ["/og-preview.png"],
  },
};

export default function HomePage() {
  return <LandingPage />;
}
