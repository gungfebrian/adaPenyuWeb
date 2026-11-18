import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { referenceGroups } from "@/features/client-data-integration/reference";
import { OperationReference } from "@/features/client-data-integration/reference-page";
import { siteConfig } from "@/lib/config/site";

const entries = referenceGroups.flatMap(({ operations }) => [...operations]);

export const dynamicParams = false;

export function generateStaticParams() {
  return entries.map(({ slug }) => ({ operation: slug }));
}

export async function generateMetadata({ params }: PageProps<"/docs/client-data-integration/[operation]">): Promise<Metadata> {
  const { operation } = await params;
  const entry = entries.find(({ slug }) => slug === operation);
  if (!entry) notFound();
  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: `${siteConfig.integrationGuidePath}/${entry.slug}` },
  };
}

export default async function OperationPage({ params }: PageProps<"/docs/client-data-integration/[operation]">) {
  const { operation } = await params;
  const entry = entries.find(({ slug }) => slug === operation);
  if (!entry) notFound();
  return <OperationReference entry={entry} />;
}
