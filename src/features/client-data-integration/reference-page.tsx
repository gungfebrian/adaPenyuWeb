import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { CopyExample } from "./copy-example";
import { ResponseExamples } from "./response-examples";
import {
  authHeader, getReferenceOperation, parameterDescriptions, referenceGroups, requestExample,
  responseSamples, schemaNotes, schemaObjects, schemaType,
  type ApiSchema, type ReferenceEntry,
} from "./reference";

const guidePath = siteConfig.integrationGuidePath;
const linkClass = "rounded-sm underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary";
const methodColors = {
  GET: "bg-sky-100 text-sky-900",
  POST: "bg-teal-100 text-teal-900",
  DELETE: "bg-rose-100 text-rose-900",
};

function Method({ method }: { method: ReferenceEntry["method"] }) {
  return (
    <span className={`shrink-0 rounded-md px-2 py-1 font-mono text-[11px] leading-none font-bold ${methodColors[method]}`}>
      {method}
    </span>
  );
}

export function ReferenceIndex({ current }: { current?: string }) {
  return (
    <nav aria-label="API endpoints" className="space-y-5">
      {referenceGroups.map(({ title, operations }) => (
        <div key={title}>
          <h3 className="mb-1 px-2 text-sm font-semibold text-primary">{title}</h3>
          <ul>
            {operations.map(({ method, slug, title }) => (
              <li key={slug}>
                <Link
                  href={`${guidePath}/${slug}`}
                  aria-current={current === slug ? "page" : undefined}
                  className="flex min-h-10 items-center gap-2 rounded-lg px-2 py-1.5 text-sm leading-snug text-secondary hover:bg-surface hover:text-primary focus-visible:outline-2 focus-visible:outline-secondary aria-[current=page]:bg-sky-50 aria-[current=page]:font-semibold aria-[current=page]:text-primary"
                >
                  <Method method={method} />
                  <span>{title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SchemaFields({ objects }: { objects: ApiSchema[] }) {
  return objects.map((object, index) => (
    <div key={object.title ?? index}>
      {objects.length > 1 && <p className="my-2 font-mono text-xs font-semibold text-primary">{object.title}</p>}
      <ul className="divide-y divide-primary/10">
        {Object.entries(object.properties ?? {}).map(([name, field]) => {
          const children = schemaObjects(field);
          const notes = schemaNotes(field);
          return (
            <li key={name} className="py-2.5">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <code className="font-mono text-sm font-semibold wrap-anywhere text-primary">{name}</code>
                <span className="min-w-0 font-mono text-xs wrap-anywhere text-secondary">{schemaType(field)}</span>
                {object.required?.includes(name) && <span className="text-xs text-secondary">required</span>}
              </div>
              {(notes.length > 0 || children.length > 0) && (
                <div className="mt-1 text-sm leading-relaxed">
                  {notes.length > 0 && <p>{notes.join(" · ")}</p>}
                  {children.length > 0 && (
                    <details className="mt-2 border-l border-primary/15 pl-3">
                      <summary aria-label={`${children.length > 1 ? "Variants" : "Fields"} for ${name}`} className="w-fit cursor-pointer rounded-sm text-sm font-medium focus-visible:outline-2 focus-visible:outline-secondary">
                        {children.length > 1 ? "Show variants" : "Show fields"}
                      </summary>
                      <SchemaFields objects={children} />
                    </details>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  ));
}

function ExamplePanel({ title, label, code }: { title: string; label: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-primary/15 bg-banner text-white shadow-sm">
      <div className="flex min-h-13 flex-wrap items-center justify-between gap-2 border-b border-white/15 px-4 py-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-white/75">{label}</span>
          <CopyExample code={code} title={title} />
        </div>
      </div>
      <pre tabIndex={0} className="max-h-[22rem] overflow-auto p-4 font-mono text-xs leading-relaxed text-sky-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function OperationReference({ entry }: { entry: ReferenceEntry }) {
  const operation = getReferenceOperation(entry);
  const auth = authHeader(entry);
  const success = Object.keys(operation.responses).find((status) => status.startsWith("2"))!;
  const group = referenceGroups.find(({ operations }) => operations.some(({ slug }) => slug === entry.slug));

  return (
    <main id="main-content" tabIndex={-1} className="px-[var(--page-gutter)] pt-28 pb-16 text-primary outline-none sm:pt-32">
      <div className="mx-auto grid max-w-[85rem] gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[14rem_minmax(0,1.25fr)_minmax(0,1fr)] xl:gap-10">
        <aside className="min-w-0 self-start lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:border-r lg:border-primary/15 lg:pr-4">
          <Link href={guidePath} className={`inline-flex min-h-11 items-center text-sm font-semibold ${linkClass}`}>Integration guide</Link>
          <details className="mt-2 rounded-xl border border-primary/15 p-3 lg:hidden">
            <summary className="cursor-pointer rounded-sm px-2 py-1 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-secondary">Browse endpoints</summary>
            <div className="mt-3"><ReferenceIndex current={entry.slug} /></div>
          </details>
          <div className="mt-4 hidden lg:block"><ReferenceIndex current={entry.slug} /></div>
        </aside>

        <article className="min-w-0 space-y-8 text-base leading-relaxed text-secondary">
          <header>
            <p className="text-sm font-semibold text-secondary">{group?.title}</p>
            <h1 className="mt-2 text-4xl leading-tight font-semibold tracking-tight text-primary">{entry.title}</h1>
            <p className="mt-3">{entry.description}</p>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-primary/15 bg-surface p-3">
              <Method method={entry.method} />
              <code className="min-w-0 font-mono text-sm wrap-anywhere text-primary">{entry.path}</code>
            </div>
            <a href="#examples" className={`mt-3 inline-flex min-h-11 items-center text-sm xl:hidden ${linkClass}`}>View examples</a>
          </header>

          <section aria-labelledby="authentication">
            <h2 id="authentication" className="border-b border-primary/15 pb-2 text-xl font-semibold text-primary">Authentication</h2>
            <p className="mt-3 text-sm leading-relaxed"><code className="font-mono font-semibold text-primary">{auth.name}</code> <span className="text-xs">required header</span></p>
            <p className="mt-1 text-sm">{auth.description}</p>
            <Link href={`${guidePath}#get-an-api-key`} className={`mt-1 inline-flex min-h-10 items-center text-sm ${linkClass}`}>Set up access</Link>
          </section>

          <section aria-labelledby="parameters">
            <h2 id="parameters" className="border-b border-primary/15 pb-2 text-xl font-semibold text-primary">Parameters</h2>
            {operation.parameters?.length ? (
              <dl className="divide-y divide-primary/10">
                {operation.parameters.map(({ name, in: location, required, schema }) => {
                  const notes = schemaNotes(schema);
                  return (
                    <div key={name} className="py-3">
                      <dt className="flex flex-wrap items-baseline gap-2">
                        <code className="font-mono text-sm font-semibold text-primary">{name}</code>
                        <span className="font-mono text-xs wrap-anywhere">{schemaType(schema)}</span>
                        <span className="text-xs">{location} · {required ? "required" : "optional"}</span>
                      </dt>
                      <dd className="mt-1 text-sm">
                        {parameterDescriptions[name]}
                        {notes.length > 0 && <span className="mt-1 block font-mono text-xs">{notes.join(" · ")}</span>}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            ) : <p className="mt-3 text-sm">This operation takes no path or query parameters.</p>}
            {entry.method !== "GET" && <p className="mt-2 text-sm">This operation takes no request body.</p>}
          </section>

          <section aria-labelledby="responses">
            <h2 id="responses" className="border-b border-primary/15 pb-2 text-xl font-semibold text-primary">Responses</h2>
            <div className="mt-4 space-y-2">
              {Object.entries(operation.responses).map(([status, response]) => (
                <details key={status} open={status === success} className="rounded-lg border border-primary/15 text-sm">
                  <summary className="cursor-pointer rounded-lg px-3 py-2.5 focus-visible:outline-2 focus-visible:outline-secondary">
                    <code className={`mx-1 rounded px-1.5 py-0.5 font-mono font-semibold ${status === success ? "bg-teal-100 text-teal-900" : "bg-surface text-secondary"}`}>{status}</code>
                    <span className="ml-1 text-primary">{status === "204" ? "No content" : response.description}</span>
                  </summary>
                  <div className="border-t border-primary/10 px-4 py-2">
                    {!response.content && <p className="py-2">Empty response body.</p>}
                    {Object.entries(response.content ?? {}).map(([media, { schema }]) => (
                      <div key={media} className="py-2">
                        <p className="flex flex-wrap gap-x-2 font-mono text-xs">
                          <span className="font-semibold text-primary">{media}</span>
                          {schema && <span>{schemaType(schema)}</span>}
                        </p>
                        {schema && <SchemaFields objects={schemaObjects(schema)} />}
                      </div>
                    ))}
                    {Object.entries(response.headers ?? {}).map(([name, header]) => (
                      <p key={name} className="py-2">
                        <code className="font-mono font-semibold text-primary">{name}</code> · {header.description}
                      </p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </article>

        <aside id="examples" aria-label="Request and response examples" className="min-w-0 scroll-mt-28 space-y-4 self-start xl:sticky xl:top-28 xl:max-h-[calc(100dvh-8rem)] xl:overflow-y-auto xl:p-px">
          <ExamplePanel key={entry.slug} title="Request example" label="curl" code={requestExample(entry)} />
          <ResponseExamples key={entry.slug} samples={responseSamples(entry)} />
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-secondary">
            <a href={`${guidePath}/openapi.json`} className={`inline-flex min-h-10 items-center ${linkClass}`}>OpenAPI JSON</a>
            <a href={`${guidePath}.md`} className={`inline-flex min-h-10 items-center ${linkClass}`}>View as Markdown</a>
          </div>
        </aside>
      </div>
    </main>
  );
}
