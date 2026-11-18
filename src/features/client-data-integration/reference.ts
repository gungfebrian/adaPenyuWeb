import examples from "./examples.json";
import specification from "./openapi.json";

export type ApiSchema = {
  $ref?: string;
  type?: string;
  format?: string;
  title?: string;
  description?: string;
  enum?: readonly string[];
  const?: string;
  minimum?: number;
  maximum?: number;
  default?: unknown;
  items?: ApiSchema;
  properties?: Record<string, ApiSchema>;
  required?: readonly string[];
  anyOf?: readonly ApiSchema[];
  oneOf?: readonly ApiSchema[];
};

type MediaType = { schema?: ApiSchema };
type Header = { description?: string; schema: ApiSchema };

type ApiOperation = {
  parameters?: { name: string; in: string; required: boolean; schema: ApiSchema }[];
  responses: Record<string, { description: string; content?: Record<string, MediaType>; headers?: Record<string, Header> }>;
};

const paths: Record<string, Record<string, ApiOperation>> = specification.paths;
const schemas: Record<string, ApiSchema> = specification.components.schemas;

const integrationPrefix = "/api/integration/v1";
const keyPath = "/api/v1/organization/api-key";

export const referenceGroups = [
  {
    title: "Turtle profiles",
    operations: [
      { slug: "list-turtles", title: "List turtle profiles", method: "GET", path: integrationPrefix + "/individuals", description: "Search and filter your organization’s turtle profiles. Each profile includes identity photos and a sighting summary." },
      { slug: "get-turtle", title: "Get a turtle profile", method: "GET", path: integrationPrefix + "/individuals/{individual_id}", description: "Get a turtle profile and its sighting summary by individual ID." },
      { slug: "list-turtle-sightings", title: "List a turtle’s sightings", method: "GET", path: integrationPrefix + "/individuals/{individual_id}/logs", description: "Get a page of sightings from a single turtle’s history, newest first." },
      { slug: "get-identity-photo", title: "Download an identity photo", method: "GET", path: integrationPrefix + "/individuals/{individual_id}/photos/{side}", description: "Download the left or right identity photo in its stored image format." },
    ],
  },
  {
    title: "Sightings",
    operations: [
      { slug: "list-sightings", title: "List sightings", method: "GET", path: integrationPrefix + "/logs", description: "Get a page of your organization’s sightings. Set identified_only=false to include sightings without an identified turtle." },
      { slug: "get-sighting", title: "Get a sighting", method: "GET", path: integrationPrefix + "/logs/{log_id}", description: "Get a sighting’s event, location, condition, measurements, identification, and photo metadata." },
      { slug: "get-sighting-photo", title: "Download a sighting photo", method: "GET", path: integrationPrefix + "/logs/{log_id}/photos/{photo_id}", description: "Download a photo attached to a sighting in its stored image format." },
    ],
  },
  {
    title: "Owner key management",
    operations: [
      { slug: "get-api-key-status", title: "Get API key status", method: "GET", path: keyPath, description: "Check whether your organization has an active key and see its prefix and issue time." },
      { slug: "rotate-api-key", title: "Generate or rotate the API key", method: "POST", path: keyPath + "/rotate", description: "Issue a new key and return its full value once. If a key is already active, it stops working immediately." },
      { slug: "revoke-api-key", title: "Revoke the API key", method: "DELETE", path: keyPath, description: "Revoke the current key. A repeated request after revocation also returns 204." },
    ],
  },
] as const;

export type ReferenceEntry = (typeof referenceGroups)[number]["operations"][number];

export function getReferenceOperation(entry: ReferenceEntry) {
  return paths[entry.path][entry.method.toLowerCase()];
}

export function authHeader(entry: ReferenceEntry) {
  return entry.path.startsWith(integrationPrefix)
    ? { name: "X-API-Key", value: "$ADAPENYU_API_KEY", description: "The organization’s active integration key." }
    : { name: "Authorization", value: "Bearer $OWNER_ACCESS_TOKEN", description: "An access token from normal sign-in as the organization owner." };
}

export const parameterDescriptions: Readonly<Record<string, string>> = {
  individual_id: "The turtle profile ID.",
  log_id: "The sighting ID.",
  photo_id: "The photo ID from the sighting’s photos array.",
  side: "The side of the turtle’s identity photo.",
  q: "Search text for turtle profiles.",
  species: "A turtle species. Repeat the query parameter to select multiple species.",
  condition: "Filter profiles by condition.",
  sort: "Use name or last_seen_desc.",
  limit: "Maximum number of records to return.",
  offset: "Number of records to skip.",
  since: "Include sightings on or after this observation timestamp.",
  until: "Include sightings on or before this observation timestamp.",
  identified_only: "Set to false to include sightings without an identified turtle.",
  has_coordinates: "Set to true to require latitude and longitude.",
};

export function resolveSchema(schema: ApiSchema): ApiSchema {
  return schema.$ref ? schemas[schema.$ref.split("/").at(-1)!] ?? schema : schema;
}

export function schemaType(schema: ApiSchema): string {
  if (schema.$ref) return resolveSchema(schema).title ?? schema.$ref.split("/").at(-1)!;
  if (schema.const) return schema.const;
  if (schema.anyOf) return schema.anyOf.map(schemaType).join(" | ");
  if (schema.oneOf) return schema.oneOf.map(schemaType).join(" | ");
  if (schema.items) return `array of ${schemaType(schema.items)}`;
  return [schema.type, schema.format].filter(Boolean).join(" · ") || "object";
}

export function schemaObjects(schema: ApiSchema): ApiSchema[] {
  const resolved = resolveSchema(schema);
  if (resolved.properties) return [resolved];
  if (resolved.items) return schemaObjects(resolved.items);
  return (resolved.anyOf ?? resolved.oneOf ?? []).flatMap(schemaObjects);
}

export function schemaNotes(schema: ApiSchema): string[] {
  const resolved = resolveSchema(schema);
  const enumValues = resolved.enum ?? (resolved.items && resolveSchema(resolved.items).enum);
  const variants = (resolved.anyOf ?? []).flatMap(schemaNotes);
  return [
    resolved.description,
    enumValues && `Values ${enumValues.join(", ")}`,
    resolved.minimum !== undefined && `Minimum ${resolved.minimum}`,
    resolved.maximum !== undefined && `Maximum ${resolved.maximum}`,
    resolved.default !== undefined && resolved.default !== null && `Default ${JSON.stringify(resolved.default)}`,
    ...variants,
  ].filter((note): note is string => typeof note === "string");
}

export function requestExample(entry: ReferenceEntry) {
  let url = entry.path
    .replace("{individual_id}", examples.turtle.id)
    .replace("{log_id}", examples.sighting.id)
    .replace("{photo_id}", examples.sighting.photos[0].id)
    .replace("{side}", "left");

  if (entry.slug === "list-turtles" || entry.slug === "list-turtle-sightings") url += "?limit=50&offset=0";
  if (entry.slug === "list-sightings") url += "?identified_only=false&limit=50&offset=0";

  const auth = authHeader(entry);
  const parts = [
    `curl --fail-with-body --request ${entry.method}`,
    `  --url "$BASE_URL${url}"`,
    `  --header "${auth.name}: ${auth.value}"`,
  ];
  if (entry.path.includes("/photos/")) parts.push('  --output "turtle-photo"');
  return parts.join(" \\\n");
}

export function responseExample(entry: ReferenceEntry): unknown {
  const page = { total: 1, limit: 50, offset: 0 };
  const activeKey = { configured: true, prefix: "adapenyu_example", issued_at: "2026-11-04T08:00:00Z" };

  switch (entry.slug) {
    case "list-turtles": return { items: [examples.turtle], ...page };
    case "get-turtle": return examples.turtle;
    case "list-turtle-sightings":
    case "list-sightings": return { items: [examples.sighting], ...page };
    case "get-sighting": return examples.sighting;
    case "get-api-key-status": return activeKey;
    case "rotate-api-key": return { ...activeKey, api_key: "<full key returned once>" };
  }
}

export function errorExample(entry: ReferenceEntry, status: string) {
  switch (status) {
    case "401":
      return { detail: authHeader(entry).name === "X-API-Key" ? "Invalid or missing API key" : "Authentication required" };
    case "403": return { detail: "Owner access required" };
    case "404":
      return { detail: entry.path.includes("/photos/") ? "Photo not found" : entry.path.startsWith(integrationPrefix + "/logs") ? "Log not found" : "Individual not found" };
    case "413": return { detail: "Request body exceeds maximum size" };
    case "422": {
      const pathParameter = getReferenceOperation(entry).parameters?.find((parameter) => parameter.in === "path");
      return {
        detail: pathParameter ? [{
          type: "uuid_parsing",
          loc: ["path", pathParameter.name],
          msg: "Input should be a valid UUID, invalid length: expected length 32 for simple format, found 3",
        }] : [{
          type: "greater_than_equal",
          loc: ["query", "limit"],
          msg: "Input should be greater than or equal to 1",
        }],
      };
    }
    case "429": return { detail: "Too many attempts; try again later" };
    case "500": return { detail: "Internal server error" };
    case "503": return { detail: "Photo storage temporarily unavailable" };
  }
}

export type ResponseSample = {
  status: string;
  label: string;
  code: string;
  copyable: boolean;
};

export function responseSamples(entry: ReferenceEntry): ResponseSample[] {
  return Object.entries(getReferenceOperation(entry).responses).flatMap<ResponseSample>(([status, response]) => {
    const example = status.startsWith("2") ? responseExample(entry) : errorExample(entry, status);
    if (example !== undefined) return [{ status, label: "JSON", code: JSON.stringify(example, null, 2), copyable: true }];
    if (status === "204") return [{ status, label: "No content", code: "Empty response body", copyable: false }];
    const mediaTypes = Object.keys(response.content ?? {});
    if (status === "200" && mediaTypes.length) {
      return [{ status, label: "Binary", code: `Binary image data\n${mediaTypes.join("\n")}`, copyable: false }];
    }
    return [];
  });
}
