import type { Metadata } from "next";

import { MatchCandidateList } from "@/features/re-identification/components/match-candidate-list";
import { PhotoUpload } from "@/features/re-identification/components/photo-upload";

export const metadata: Metadata = { title: "Identify a turtle" };

export default function IdentifyPage() {
  return (
    <section className="grid gap-5">
      <h1>Identify a turtle</h1>
      <PhotoUpload />
      <MatchCandidateList candidates={[]} />
    </section>
  );
}
