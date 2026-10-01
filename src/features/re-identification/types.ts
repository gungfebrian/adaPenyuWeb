import type { Turtle } from "@/features/turtles/types";

/** Refers to a future stored photo; raw image data is not part of this contract. */
export interface ReIdentificationRequest {
  photoId: string;
}

export interface MatchCandidate {
  turtleId: Turtle["id"];
  rank: number;
  /** Model similarity score; it is not a calibrated probability of identity. */
  similarityScore: number;
}

export interface ReIdentificationResult {
  photoId: string;
  modelVersion: string;
  candidates: readonly MatchCandidate[];
}
