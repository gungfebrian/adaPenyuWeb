import specification from "@/features/client-data-integration/openapi.json";

export const dynamic = "force-static";

export function GET() {
  return Response.json(specification);
}
