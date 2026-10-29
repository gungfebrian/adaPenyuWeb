# Contributing to AdaPenyu

Use this guide to prepare a focused change for review. Follow the [local setup](README.md#run-locally) before starting.

## Prepare a change

1. Check `git status --short` and preserve unrelated work.
2. Create a branch for the change: `git switch -c <branch-name>`.
3. Keep route components small and place feature code in `src/features/<feature>`.
4. Review `git diff` and stage only the files that belong to the change.

Use pnpm for dependency changes and include both `package.json` and `pnpm-lock.yaml`.
Keep credentials in the local environment file described in the README.

## Verify and describe the result

Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`. For account action, scheduler,
backup, or session changes, also run the regression suite with Node.js 22.18 or
newer within the project's pinned Node 22 major:

```bash
node --test tests/*.test.mjs
```

See the [test coverage map](docs/test-coverage.md) for individual test files and
the limits of those checks. For interactive changes, use the
[manual UI checklist](docs/manual-ui-checks.md). Record the commands you ran,
Node version, and results in the pull request, along with any checks you could
not complete. Report browser checks separately from automated results.

Describe what visitors can do after the change and include screenshots when the
layout changes. Keep each commit focused on a reviewable change. A push to `main`
starts the connected deployment; confirm the hosting build before reporting that
the live site is updated.
