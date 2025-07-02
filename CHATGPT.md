# CHATGPT Guidelines

This document summarizes how ChatGPT should interact with the **Atomic Testing** repository.
It condenses the key points from `CLAUDE.md` for quick reference.

## Getting Started

1. Install dependencies with:
   ```bash
   pnpm install
   ```
2. Use the workspace commands for quality checks:
   ```bash
   pnpm run check:lint   # ESLint with fixes
   pnpm run check:style  # Prettier formatting
   pnpm run check:type   # Type checking across packages
   ```
3. Package-specific commands are run inside each package directory:
   ```bash
   pnpm test         # Jest unit tests
   pnpm run test:e2e # Playwright end-to-end tests
   pnpm run build    # Build the package via tsdown
   ```
4. For documentation:
   ```bash
   pnpm run typedoc
   cd docs && pnpm build
   ```
   Always build the docs before submitting documentation-related PRs.

## Repository Layout

- `packages/` – source for core, framework adapters, and component drivers.
- `package-tests/` – tests validating component drivers across environments.
- `docs/` – Docusaurus site and API docs.
- `examples/` – demonstration projects showing real-world usage.

## Architecture Overview

Atomic Testing uses a **component driver** pattern:

1. `TestEngine` orchestrates interactions.
2. `ComponentDriver` provides high‑level semantic APIs.
3. `Interactor` implements framework‑specific behavior.
4. `PartLocator` selects DOM elements using composable locators.

Drivers work consistently across React, Vue, Playwright, and plain DOM environments.
Scene parts declare component hierarchies with strong typing using `satisfies ScenePart`.

## Best Practices

- Keep code formatted and linted; CI will auto‑format on commit.
- Write tests in both DOM (`*.dom.test.ts`) and E2E (`*.e2e.test.ts`) forms.
- Prefer `byDataTestId()` for locating elements. Chain locators when needed.
- Driver classes are named `{Framework}{Component}Driver`.
- Review examples in `package-tests/*/src/examples/` when implementing new drivers.

## Troubleshooting

- React: ensure interactions are wrapped in `act()`.
- Vue: `nextTick()` must run after updates.
- CI failures often stem from missing `await` or mismatched directory names in `package-tests`.
- When docs fail, check frontmatter `id` fields and relative links.

## CI/CD Notes

GitHub Actions build packages once and run tests in parallel for efficiency.
Artifacts are shared between jobs to avoid redundant builds.

---

These guidelines should help ChatGPT navigate the repository efficiently while keeping
changes consistent with project standards.
