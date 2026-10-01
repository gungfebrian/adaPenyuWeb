import { AppHeader } from "@/components/layout/app-header";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <><AppHeader /><main id="main-content" className="mx-auto w-full max-w-[60rem] flex-1 px-5 py-8">{children}</main></>;
}
