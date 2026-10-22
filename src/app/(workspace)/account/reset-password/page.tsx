import type { Metadata } from "next";
import { AccountActionScreen } from "@/features/account/components/account-action-screen";
import { getActiveWebSession } from "@/features/account/server/session";

export const metadata: Metadata = {
  title: "Reset Password",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ResetPasswordPage() {
  const session = await getActiveWebSession();
  return <AccountActionScreen kind="reset-password" initialSession={session} />;
}
