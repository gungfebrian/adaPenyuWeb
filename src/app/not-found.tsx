import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto w-full max-w-[60rem] flex-1 px-5 py-8">
      <h1>Page not found</h1>
      <Link className="focus-visible:outline-solid focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4" href="/">Return to the home page</Link>
    </main>
  );
}
