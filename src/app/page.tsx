import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      <h1>AdaPenyuWeb</h1>
      <p>Turtle photo re-identification.</p>
      <p>This starter contains placeholder pages for the future workflow.</p>
      <Link href="/identify">Open the identification page</Link>
    </section>
  );
}
