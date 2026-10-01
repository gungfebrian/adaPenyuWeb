# AdaPenyuWeb

A Next.js and TypeScript scaffold for turtle photo re-identification.

## Status

The project currently provides folder structure, typed contracts, and placeholder
pages. Uploads, inference, persistence, and identity review are not connected.
The placeholder POST endpoint returns HTTP 501.

This scaffold extends the existing Next.js 16.3.8 and Tailwind CSS 4 project.

## Local setup

Use Node.js 20.9 or newer. From this folder:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The available checks are:

```bash
npm run lint
npm run typecheck
npm run build
```

Keep the generated package-lock.json in version control.

## Where to start

- [design.md](design.md): folder map, architecture decisions, and developer boundaries.
- [docs/stakeholder-overview.md](docs/stakeholder-overview.md): plain-language scope and proposed workflow.
- [CLAUDE.md](CLAUDE.md): local guidance for coding assistants.
- `src/app`: pages and API entry points.
- `src/features`: turtle records and re-identification components and types.

The existing .gitignore excludes all Markdown files, including these documents.
They are local documents under the current Git preference.
