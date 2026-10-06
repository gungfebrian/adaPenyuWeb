import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GoogleSignIn } from "@/features/auth/google-sign-in";
import { createClient, isGoogleProviderEnabled } from "@/utils/supabase/server";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims?.sub && !error) redirect("/schedule");

  return <section className="mx-auto max-w-xl py-8 sm:py-16">
    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Sign in to arrange a meeting.</h1>
    <p className="mt-4 leading-relaxed text-foreground/75">Use your Google account to access your schedule and plan conversations with professors and doctors.</p>
    {error && <p role="alert" className="mt-5 rounded-xl bg-foreground/5 p-4 text-sm">{error === "signout" ? "We couldn’t sign you out. Please try again." : "Sign-in wasn’t completed. Please try again with Google."}</p>}
    <GoogleSignIn enabled={await isGoogleProviderEnabled()} />
    <p className="mt-4 text-sm leading-relaxed text-foreground/65">Meetings currently stay in this browser. Account sync and meeting invitations are coming later.</p>
  </section>;
}
