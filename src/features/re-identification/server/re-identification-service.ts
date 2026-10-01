import "server-only";

import type {
  ReIdentificationRequest,
  ReIdentificationResult,
} from "@/features/re-identification/types";

/** Adapter contract for the future model integration. */
export interface ReIdentificationService {
  findCandidates(
    request: ReIdentificationRequest,
  ): Promise<ReIdentificationResult>;
}
