import { integrationGuide } from "@/features/client-data-integration/guide";
import {
  authHeader, getReferenceOperation, parameterDescriptions, referenceGroups,
  requestExample, responseSamples, schemaNotes, schemaType, type ReferenceEntry,
} from "@/features/client-data-integration/reference";
import { siteConfig } from "@/lib/config/site";

export const dynamic = "force-static";

function endpointMarkdown(entry: ReferenceEntry): string {
  const operation = getReferenceOperation(entry);
  const auth = authHeader(entry);
  return [
    `#### ${entry.title}\n\n\`${entry.method} ${entry.path}\`\n\n${entry.description}`,
    `**Authentication** · \`${auth.name}\` is required. ${auth.description}`,
    ...(operation.parameters ?? []).map(({ name, in: location, required, schema }) =>
      `- \`${name}\` · ${location}, ${required ? "required" : "optional"}, \`${schemaType(schema)}\`. ${parameterDescriptions[name]} ${schemaNotes(schema).join(". ")}`.trimEnd(),
    ),
    ...Object.entries(operation.responses).map(([status, { description, content, headers }]) => {
      const types = Object.entries(content ?? {}).map(([media, { schema }]) =>
        schema ? `\`${media}\` (\`${schemaType(schema)}\`)` : `\`${media}\``,
      );
      const responseHeaders = Object.keys(headers ?? {});
      return `- **${status}** · ${status === "204" ? "No content" : description}${types.length ? ` · ${types.join(", ")}` : ""}${responseHeaders.length ? ` · Headers ${responseHeaders.join(", ")}` : ""}`;
    }),
    `~~~bash\n${requestExample(entry)}\n~~~`,
    ...responseSamples(entry).map(({ status, label, code, copyable }) =>
      `**${status} · ${label}**\n\n${copyable ? `~~~json\n${code}\n~~~` : code}`,
    ),
  ].join("\n\n");
}

export function GET() {
  const markdown = [
    `# ${integrationGuide.title}`,
    integrationGuide.introduction,
    ...integrationGuide.sections.map(({ title, markdown }) => `## ${title}\n\n${markdown}`),
    `## API reference\n\n[OpenAPI JSON](${siteConfig.url}${siteConfig.integrationGuidePath}/openapi.json)`,
    ...referenceGroups.map(({ title, operations }) => [`### ${title}`, ...operations.map(endpointMarkdown)].join("\n\n")),
  ].join("\n\n");

  return new Response(`${markdown}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<${siteConfig.url}${siteConfig.integrationGuidePath}>; rel="canonical", </llms.txt>; rel="describedby"`,
    },
  });
}
