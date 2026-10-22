import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export interface ActiveWebSession {
  isSignedIn: boolean;
  email: string | null;
}

export async function getActiveWebSession(): Promise<ActiveWebSession> {
  const cookieStore = await cookies();
  const hasAuthCookie = cookieStore
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-"));

  if (!hasAuthCookie) {
    return { isSignedIn: false, email: null };
  }

  try {
    const supabase = await createClient(cookieStore);
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims?.sub) {
      return { isSignedIn: false, email: null };
    }
    return {
      isSignedIn: true,
      email: typeof data.claims.email === "string" ? data.claims.email : null,
    };
  } catch {
    return { isSignedIn: false, email: null };
  }
}
