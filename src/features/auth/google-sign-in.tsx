"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export function GoogleSignIn({ enabled }: { enabled: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function signIn() {
    setPending(true);
    setError("");
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      });
      if (error || !data.url) throw error ?? new Error("No sign-in URL returned.");
      window.location.assign(data.url);
    } catch {
      setError("Google sign-in is unavailable right now. Please try again later.");
      setPending(false);
    }
  }

  return <div className="mt-6 grid gap-3">
    <Button className="w-full font-sans sm:w-fit" onClick={signIn} disabled={pending || !enabled}>{pending ? "Opening Google…" : "Continue with Google"}</Button>
    {!enabled && <p className="text-sm text-foreground/75">Google sign-in is currently unavailable. Please check back later.</p>}
    <p role="alert" className="min-h-6 text-sm">{error}</p>
  </div>;
}
