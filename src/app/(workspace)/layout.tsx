import { AppHeader } from "@/components/layout/app-header";
import { DM_Sans, Manrope } from "next/font/google";
import "@/components/layout/workspace.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <div className={`workspace-shell ${dmSans.variable} ${manrope.variable}`}><AppHeader /><main id="main-content" className="workspace-content mx-auto w-full max-w-[60rem] flex-1 px-5 py-8">{children}</main></div>;
}
