import { EmptyState } from "@/components/ui/empty-state";
import type { Turtle } from "@/features/turtles/types";

interface TurtleListProps {
  turtles: readonly Turtle[];
}

export function TurtleList({ turtles }: TurtleListProps) {
  if (turtles.length === 0) {
    return (
      <EmptyState
        title="Turtle records"
        description="The turtle catalogue is not connected yet."
      />
    );
  }

  return (
    <ul>
      {turtles.map((turtle) => (
        <li key={turtle.id}>
          {turtle.displayName} — {turtle.species ?? "Species not recorded"}
        </li>
      ))}
    </ul>
  );
}
