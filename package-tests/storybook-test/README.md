# @atomic-testing/storybook-test

Validation fixture for `@atomic-testing/storybook` (issue #951): runs
Driver-powered stories as real-browser Vitest tests through
`@storybook/addon-vitest` (Vitest 4 browser mode, Playwright/Chromium).

The stories exercise both `play`-wrapping helpers — `withDriver` (single driver
rooted at the story's root element) and `withTestEngine` (multi-part
`ScenePart` engine) — with post-interaction reads that require settling.

```bash
pnpm test:storybook       # headless Chromium run (vitest run)
pnpm storybook            # inspect the same stories in the Storybook UI
```

If Playwright's browser registry is unavailable (sandboxed environments), point
`CHROMIUM_EXECUTABLE` at a Chromium binary.
