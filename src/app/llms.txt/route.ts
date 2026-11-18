import { integrationGuide } from "@/features/client-data-integration/guide";
import { siteConfig } from "@/lib/config/site";

export const dynamic = "force-static";

export function GET() {
  const index = `# ${siteConfig.name}

> AdaPenyu documents and identifies individual sea turtles through their facial patterns.

## Documentation

- [${integrationGuide.title}](${siteConfig.url}${siteConfig.integrationGuidePath}.md): Organization API key setup, read-only endpoints, response examples, and troubleshooting.
- [AdaPenyu Integration OpenAPI](${siteConfig.url}${siteConfig.integrationGuidePath}/openapi.json): Request parameters, response schemas, and authentication for the integration and owner key endpoints.
`;

  return new Response(index, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
