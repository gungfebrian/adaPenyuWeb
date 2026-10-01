import Link from "next/link";

import { siteConfig } from "@/lib/config/site";

const linkClass = "inline-flex min-h-11 items-center rounded-full px-4 transition-colors duration-200 hover:bg-foreground/8 focus-visible:outline-solid focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4";

export function AppHeader() {
  return (
    <header className="flex flex-wrap justify-between gap-4 border-b border-foreground/20 p-5">
      <Link className={linkClass} href="/">{siteConfig.name}</Link>
      <nav className="flex flex-wrap gap-4" aria-label="Main navigation">
        <Link className={linkClass} href="/identify">Identify a turtle</Link>
        <Link className={linkClass} href="/turtles">Turtle catalogue</Link>
      </nav>
    </header>
  );
}
