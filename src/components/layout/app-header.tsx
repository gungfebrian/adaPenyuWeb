import Link from "next/link";

import { siteConfig } from "@/lib/config/site";

export function AppHeader() {
  return (
    <header className="app-header">
      <Link href="/">{siteConfig.name}</Link>
      <nav aria-label="Main navigation">
        <Link href="/identify">Identify a turtle</Link>
        <Link href="/turtles">Turtle catalogue</Link>
      </nav>
    </header>
  );
}
