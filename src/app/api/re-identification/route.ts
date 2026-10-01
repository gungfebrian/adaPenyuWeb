import type { ApiResponse } from "@/types/api";

/** Placeholder endpoint. Connect the service after request validation is defined. */
export async function POST() {
  const response: ApiResponse<never> = {
    success: false,
    error: {
      code: "NOT_IMPLEMENTED",
      message: "The re-identification service is not connected yet.",
    },
  };

  return Response.json(response, { status: 501 });
}
