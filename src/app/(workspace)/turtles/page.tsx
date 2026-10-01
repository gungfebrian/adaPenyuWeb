import type { Metadata } from "next";

import { TurtleList } from "@/features/turtles/components/turtle-list";

export const metadata: Metadata = { title: "Turtle catalogue" };

export default function TurtlesPage() {
  return (
    <section className="grid gap-5">
      <h1>Turtle catalogue</h1>
      <TurtleList turtles={[]} />
    </section>
  );
}
