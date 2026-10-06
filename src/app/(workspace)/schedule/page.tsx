import type { Metadata } from "next";
import { ScheduleWorkspace } from "@/features/schedule/schedule-workspace";

export const metadata: Metadata = { title: "Calendar", robots: { index: false, follow: false } };
export default function SchedulePage() { return <ScheduleWorkspace />; }
