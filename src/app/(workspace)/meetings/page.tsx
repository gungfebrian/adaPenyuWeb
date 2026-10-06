import type { Metadata } from "next";
import { ScheduleWorkspace } from "@/features/schedule/schedule-workspace";

export const metadata: Metadata = { title: "Meetings", robots: { index: false, follow: false } };
export default function MeetingsPage() { return <ScheduleWorkspace initialView="meetings" />; }
