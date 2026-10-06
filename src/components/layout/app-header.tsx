"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const linkClass = "workspace-nav-link";

export function AppHeader() {
  const pathname = usePathname();
  return (
    <header className="workspace-header">
      <div className="workspace-nav">
      <Link className="workspace-brand" href="/" aria-label="AdaPenyu home"><span aria-hidden="true" /></Link>
      <nav className="flex flex-wrap gap-4" aria-label="Main navigation">
        <Link className={linkClass} href="/schedule" aria-current={pathname === "/schedule" ? "page" : undefined}>Calendar</Link>
        <Link className={linkClass} href="/meetings" aria-current={pathname === "/meetings" ? "page" : undefined}>Meetings</Link>
      </nav>
      </div>
    </header>
  );
}
