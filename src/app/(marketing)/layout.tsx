import { DM_Sans, DynaPuff, Manrope } from "next/font/google";
import { LandingHeader } from "@/features/marketing/components/landing-header";
import { ChapterTransition } from "@/features/marketing/components/chapter-transition";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const dynaPuff = DynaPuff({ variable: "--font-dynapuff", subsets: ["latin"], display: "swap" });

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${dmSans.variable} ${manrope.variable} ${dynaPuff.variable} min-h-dvh overflow-x-clip bg-paper text-ink [--page-gutter:clamp(24px,5.3vw,80px)]`}>
      <div className="relative font-body [font-optical-sizing:none] [font-variation-settings:'opsz'_14]">
        <LandingHeader />
        <ChapterTransition />
        <div className="@container relative mx-auto w-full max-w-[1512px]">{children}</div>
      </div>
    </div>
  );
}
