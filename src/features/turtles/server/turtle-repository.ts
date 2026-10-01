import "server-only";

import type { Turtle } from "@/features/turtles/types";

/** A contract for future persistence. No database adapter is connected yet. */
export interface TurtleRepository {
  list(): Promise<readonly Turtle[]>;
  findById(id: Turtle["id"]): Promise<Turtle | null>;
}
