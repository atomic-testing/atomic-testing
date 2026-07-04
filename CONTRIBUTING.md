# Contributing to Atomic Testing

Thanks for your interest in contributing. Atomic Testing is a portable UI
testing library built on the "component driver" pattern, spanning packages for
React, Vue, Playwright, and plain DOM. This guide covers how to get set up and
what's expected before you open a pull request.

## Development setup

1. Install Node.js (v22.12 or newer) and [pnpm](https://pnpm.io/) (v10 or newer).
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Make your change in the relevant package(s) under `packages/`.

## Checks

Before submitting a pull request, run:

```bash
pnpm run check:type             # Type check all packages with tsgo
pnpm run check:lint             # oxlint with auto-fix
pnpm run check:style            # Format with oxfmt
pnpm test:dom                   # Jest tests (run from the package directory)
pnpm test:e2e                   # Playwright tests (requires dev server running)
```

See the root [`CLAUDE.md`](CLAUDE.md) for the full command reference, including
how to start the dev server for `test:e2e`.

### The stale-`dist` trap

If you change a package's `src` and a test elsewhere doesn't seem to pick it
up, read the **stale-`dist` trap** section in [`CLAUDE.md`](CLAUDE.md) before
you assume something else is wrong — every test runner in this repo resolves
`@atomic-testing/*` imports to a package's built `dist`, not its `src`.

## Architectural changes

If your change is architecturally significant (a new abstraction, a change to
the `Interactor` contract, a new locator boundary, a versioning/support-policy
change, etc.), it should reference an existing ADR or add a new one under
[`agent-docs/adr/`](agent-docs/adr/). See [`agent-docs/INDEX.md`](agent-docs/INDEX.md)
for the current ADR list and index conventions.

## Commit & PR message conventions

This project generates its CHANGELOG automatically from commit subjects, so
write them for the people who will read the changelog, not just for reviewers.

Format: `type(scope): summary`, optionally ending with related issue/PR numbers
in parentheses, e.g.:

    feat(playwright): add drag-and-drop primitive to PlaywrightInteractor (#123)
    fix(dom-core): stop enterText clobbering existing selection (#456)

Types:
- `feat` — new capability (Features)
- `fix` — bug fix (Fixes)
- `perf` — performance improvement (Performance)
- `refactor` — behavior-preserving internal change (Refactoring)
- `docs` — documentation only (Documentation)
- `build` — release/build tooling (Build & Tooling)
- `chore`, `style`, `test` — internal only; excluded from the changelog

Add `!` after the type/scope (e.g. `feat(core)!: ...`) for a breaking change —
it goes into its own "Breaking Changes" section regardless of type.

PRs are squash-merged, so the **PR title becomes the commit subject** — write
the PR title in this format. See `scripts/generateChangelog.js` and
`agent-docs/RELEASING.md` for how this feeds the release changelog.
