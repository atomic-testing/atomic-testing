---
id: testing-in-storybook
sidebar_label: Testing in Storybook
sidebar_position: 2
---

# Testing in Storybook

If you already have atomic-testing drivers for your components, you can drive
them **inside Storybook 10 play functions** — in the Storybook UI and under
`@storybook/addon-vitest` ("Storybook Test", real-browser Vitest) — without
re-declaring any test logic. The `@atomic-testing/storybook` package provides a
framework-agnostic engine plus two `play`-wrapping helpers so a story test is
as small as "give me the driver, here's my assertion."

```bash
pnpm add -D @atomic-testing/storybook
```

The package is renderer-agnostic: it never imports React, Vue, or any other
framework, so the same import works in every Storybook project. `storybook@^10`
is a peer dependency.

## The lowest ramp: `withDriver`

Most stories render exactly one component. `withDriver` roots a driver class at
the story's rendered root element — no `ScenePart`, no locators, no
`canvasElement` plumbing:

```tsx
import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { withDriver } from '@atomic-testing/storybook';
import { expect } from 'storybook/test';

export const ClicksIncrement: Story = {
  args: { label: 'Clicked' },
  play: withDriver(HTMLButtonDriver, async ({ driver, args }) => {
    await driver.click();
    expect(await driver.getText()).toBe(`${args.label}: 1`);
  }),
};
```

The callback receives the **full play context** augmented with the typed
`driver`, so `args`, `step`, and friends remain available and correctly typed.

By default the driver is rooted at the canvas's first element child — the
story's rendered root. If a decorator wraps your story in extra DOM (or the
story renders several roots), pass an explicit locator instead:

```tsx
play: withDriver(MyDialogDriver, fn, { locator: byDataTestId('dialog-root') }),
```

## Multiple parts: `withTestEngine`

When the story hosts several parts, declare a `ScenePart` — the same shape you
already use everywhere else in atomic-testing — and get a canvas-scoped engine
with full type inference and automatic cleanup:

```tsx
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { withTestEngine } from '@atomic-testing/storybook';

const parts = {
  input: { locator: byDataTestId('echo-input'), driver: HTMLTextInputDriver },
  output: { locator: byDataTestId('echo-output'), driver: HTMLElementDriver },
} satisfies ScenePart;

export const TypedTextEchoes: Story = {
  play: withTestEngine(parts, async ({ engine }) => {
    await engine.parts.input.setValue('hello storybook');
    expect(await engine.parts.output.getText()).toBe('hello storybook');
  }),
};
```

## What the helpers do for you

Both helpers delegate to `StorybookInteractor`
(`packages/storybook/src/StorybookInteractor.ts`), which differs from the
React/Vue test interactors in three deliberate ways:

- **No `act()` / `nextTick()`.** In a real browser those wrappers are
  unnecessary — and React's `act()` actively emits _"The current testing
  environment is not configured to support act(...)"_ warnings in the preview
  iframe. This is why you should not use a framework adapter's
  `createRenderedTestEngine` inside Storybook.
- **Interactions appear in the Interactions panel.** The interactor dispatches
  through Storybook's instrumented `userEvent` (from `storybook/test`), so
  every driver-level click and keystroke is recorded alongside your `expect`
  and `step` entries.
- **Reads settle without hand-rolled waits.** Every mutating interaction is
  followed by a short settle (a macrotask plus two animation frames) so the
  renderer commits before your next read, and the engine's wait methods use an
  escalating probe cadence for anything genuinely asynchronous.

## Running stories as tests with addon-vitest

The same stories run headless as real-browser Vitest tests. Wire up
`@storybook/addon-vitest` with Vitest browser mode (Playwright provider):

```ts
// vitest.config.ts
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [storybookTest({ configDir: '.storybook' })],
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [{ browser: 'chromium' }],
    },
  },
});
```

Storybook 10.3+ applies your preview annotations automatically — no
`setProjectAnnotations` setup file is needed. The canonical, CI-tested wiring
lives in this repo at `package-tests/storybook-test`.

## Limitations

- Driver interactions backed by raw event dispatch rather than `userEvent` —
  positional clicks, `pressKey`, mouse-move sequences, `drag`/`dragTo` — still
  work, but are not recorded in the Interactions panel.
- Running stories in **jsdom** via `composeStories()` is a different
  environment (it sets `IS_REACT_ACT_ENVIRONMENT`, so the act-free design does
  not transfer) and is not covered by this package. Use the framework adapters
  (`@atomic-testing/react-18`, etc.) for jsdom unit tests.
