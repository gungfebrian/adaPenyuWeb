import { createAasaResponse } from "@/features/account/aasa";

export async function GET() {
  return createAasaResponse();
}
