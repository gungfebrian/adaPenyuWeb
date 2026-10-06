import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/features/auth/actions";
import { ScheduleArranger } from "./schedule-arranger";

export async function ScheduleWorkspace({ initialView = "month" }: { initialView?: "month" | "meetings" }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) redirect("/login");
  const userId = data.claims.sub;
  return <div className="schedule-page">
    <div className="schedule-account">
      <p>{typeof data.claims.email === "string" ? data.claims.email : "Signed in"}</p>
      <form action={signOut}><button type="submit">Sign out</button></form>
    </div>
    <ScheduleArranger key={`${userId}:${initialView}`} userId={userId} initialView={initialView} />
  </div>;
}
