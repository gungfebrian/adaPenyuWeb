import type { Metadata } from "next";
import Image from "next/image";
import Markdown, { type Components } from "react-markdown";
import { integrationGuide } from "@/features/client-data-integration/guide";
import { ReferenceIndex } from "@/features/client-data-integration/reference-page";
import { siteConfig } from "@/lib/config/site";

const markdownPath = `${siteConfig.integrationGuidePath}.md`;
const settingsScreenshot = "/images/docs/organization-api-key.png";

export const metadata: Metadata = {
  title: integrationGuide.title,
  description: integrationGuide.description,
  alternates: {
    canonical: siteConfig.integrationGuidePath,
    types: { "text/markdown": markdownPath },
  },
};

const markdownComponents: Components = {
  pre({ children }) {
    return (
      <pre
        tabIndex={0}
        className="overflow-x-auto rounded-xl bg-banner px-4 py-4 font-mono text-sm leading-relaxed text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary sm:px-5"
      >
        {children}
      </pre>
    );
  },
};

export default function ClientDataIntegrationPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="px-[var(--page-gutter)] pt-28 pb-16 text-primary outline-none sm:pt-32 sm:pb-20"
    >
      <div className="mx-auto max-w-[70rem]">
        <header className="border-b border-primary/15 pb-8 sm:pb-10">
          <h1 className="text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {integrationGuide.title}
          </h1>
          <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-secondary">
            {integrationGuide.introduction}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
            <a href="#read-data" className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-white hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">API reference</a>
            <a href={markdownPath} className="inline-flex min-h-11 items-center rounded-sm text-secondary underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">View as Markdown</a>
            <a href={`${siteConfig.integrationGuidePath}/openapi.json`} className="inline-flex min-h-11 items-center rounded-sm text-secondary underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">OpenAPI JSON</a>
          </div>
        </header>

        <div className="grid gap-8 pt-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12 lg:pt-10 xl:gap-16">
          <nav
            aria-labelledby="guide-contents"
            className="self-start rounded-2xl bg-surface p-4 lg:sticky lg:top-28"
          >
            <h2 id="guide-contents" className="px-2 text-sm font-semibold">
              On this page
            </h2>
            <ul className="mt-1 grid sm:grid-cols-2 lg:grid-cols-1">
              {integrationGuide.sections.map(({ id, title }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="flex min-h-11 items-center rounded-md px-2 text-sm leading-snug text-secondary hover:bg-white hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article aria-label={integrationGuide.title} className="min-w-0 max-w-[48rem] text-base leading-relaxed text-secondary">
            {integrationGuide.sections.map(({ id, title, markdown }) => (
              <section
                key={id}
                aria-labelledby={id}
                className="space-y-4 border-t border-primary/15 py-8 first:border-t-0 first:pt-0 sm:py-10"
              >
                <h2 id={id} className="scroll-mt-28 text-2xl leading-tight font-semibold tracking-tight text-primary sm:text-3xl">
                  {title}
                </h2>
                {id === "read-data" && (
                  <div className="rounded-xl border border-primary/15 bg-white p-4 sm:p-5">
                    <ReferenceIndex />
                  </div>
                )}
                {id === "manage-access" && (
                  <figure className="overflow-hidden rounded-xl border border-primary/15">
                    <Image
                      src={settingsScreenshot}
                      alt="AdaPenyu for Mac Organization API Key settings showing an active key and the Rotate Key and Revoke Key buttons."
                      width={1496}
                      height={1051}
                      sizes="(min-width: 850px) 768px, calc(100vw - 40px)"
                      className="h-auto w-full"
                    />
                    <figcaption className="flex flex-wrap items-center justify-between gap-x-4 border-t border-primary/15 bg-surface px-4 text-sm">
                      <span className="py-2">Organization API Key settings in AdaPenyu for Mac</span>
                      <a
                        href={settingsScreenshot}
                        className="inline-flex min-h-11 items-center rounded-sm font-semibold underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-secondary"
                      >
                        View full-size screenshot
                      </a>
                    </figcaption>
                  </figure>
                )}
                <div className="space-y-4 [&_blockquote]:rounded-xl [&_blockquote]:bg-surface [&_blockquote]:px-4 [&_blockquote]:py-3 [&_code]:font-mono [&_code]:text-[0.875em] [&_code]:wrap-anywhere [&_h3]:pt-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-primary [&_li+li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre_code]:text-inherit [&_strong]:font-semibold [&_strong]:text-primary [&_ul]:list-disc [&_ul]:pl-6">
                  <Markdown components={markdownComponents} skipHtml>{markdown}</Markdown>
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}
