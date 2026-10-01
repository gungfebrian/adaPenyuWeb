import type { Metadata } from "next";
import { LandingPage } from "@/features/marketing/landing-page";

export const metadata: Metadata = {
  title: "AdaPenyu — Every turtle’s story starts with recognition",
  description: "AdaPenyu helps identify individual sea turtles through their unique facial patterns.",
};

export default function HomePage() {
  return <LandingPage />;
}
