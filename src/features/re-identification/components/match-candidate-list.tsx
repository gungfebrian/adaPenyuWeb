import { EmptyState } from "@/components/ui/empty-state";
import type { MatchCandidate } from "@/features/re-identification/types";

interface MatchCandidateListProps {
  candidates: readonly MatchCandidate[];
}

export function MatchCandidateList({ candidates }: MatchCandidateListProps) {
  if (candidates.length === 0) {
    return (
      <EmptyState
        title="Candidate matches"
        description="The matching service is not connected yet."
      />
    );
  }

  return (
    <section aria-labelledby="candidate-matches-heading">
      <h2 id="candidate-matches-heading">Candidate matches</h2>
      <ol>
        {candidates.map((candidate) => (
          <li key={candidate.turtleId}>
            Turtle {candidate.turtleId} — rank {candidate.rank}, similarity score{" "}
            {candidate.similarityScore}
          </li>
        ))}
      </ol>
    </section>
  );
}
