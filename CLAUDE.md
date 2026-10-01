@AGENTS.md

# AdaPenyuWeb development guide

Follow applicable AGENTS.md instructions.

## Current scope

This is a scaffold for turtle photo re-identification. Preserve explicit placeholder
states until real integrations are requested. Do not manufacture turtle records,
model results, or confidence values.

## Structure

- Keep route files in src/app small.
- Keep feature components, types, and server contracts in src/features/<feature>.
- Put reusable UI in src/components and shared configuration in src/lib.
- Use .tsx for JSX and .ts for types, configuration, and server code.
- Import application modules through @/*.
- Prefer direct imports over broad barrel exports.
- Components are Server Components by default; add "use client" where interaction
  or browser APIs require it.
- Keep persistence and model adapters inside server/ modules with server-only.
- Extend the existing feature folders before adding abstractions.

## Checks

After dependencies are installed, use npm run lint, npm run typecheck, and npm run build.
Do not claim these passed without running them.

See design.md and docs/stakeholder-overview.md for the planned boundaries.
