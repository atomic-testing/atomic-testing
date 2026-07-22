---
name: backfill-driver-feature
description: >
  Use when backfilling a missing method or behavior onto an atomic-testing
  component driver, or adding a brand-new driver — e.g. implementing items from
  the MUI driver audit issues (#870–#873), "add getLabel/isError/isRequired to
  the X driver", "the Y driver can't reach Z", "write a driver for <component>".
  Encodes the end-to-end workflow: find the real DOM, pick an
  interactor-portable locator (accessibility-first), implement, and verify in
  BOTH jsdom and all three Playwright browsers. Includes the repo-specific
  build/test/e2e gotchas that otherwise cost an hour each.
---

# Backfilling a component-driver feature

The layer stack is `TestEngine → ComponentDriver → Interactor → PartLocator`. A
driver method is just semantic sugar over `this.interactor.<op>(locator)`, where
`locator` is CSS resolved to **one selector string** and run identically by every
interactor (jsdom for DOM/React/Vue, `page.locator()` for Playwright). The whole
game is: **find the right element relationship, express it as one portable CSS
selector, and prove it in every interactor.**

Work in batches of ≤4 clarifying questions first (see root `CLAUDE.md`). Keep the
diff surgical; surface adjacent smells, don't silently fix them.

---

## Phase 0 — Locate the work

1. Driver source: `packages/component-driver-<lib>/src/components/<Name>Driver.ts`.
   Read it **and its base** — `ComponentDriver` / `ContainerDriver` /
   `ListComponentDriver` in `packages/core/src/drivers/`. Many "missing" methods
   are already inherited (e.g. `isDisabled`, `getText`, `exists`). Don't re-add them.
2. Test package: `package-tests/component-driver-<lib>-test/`.
   - `src/examples/<component>/*.examples.tsx` — the rendered UI (often straight
     from MUI's docs).
   - `src/examples/<component>/*.suite.ts` — framework-agnostic tests + the
     `ScenePart` (locators + drivers) + the `url` the e2e navigates to.
   - `__tests__/<Name>Driver.dom.test.ts` / `.e2e.test.ts` — the Jest/Playwright
     adapters that run the suite.
   - `src/directory.tsx` — maps `url` → which examples render. Confirm your
     example is registered here.
3. Pick the example that already has the setup you need; if none exists, add a new
   `*.examples.tsx` + register it in `directory.tsx`.

## Phase 1 — Find the real DOM (don't guess)

The component library's DOM is rarely what you'd assume (MUI puts `data-testid`
on the Checkbox **root span**, not the `<input>`; the label is a _sibling under a
wrapping `<label>`_, not a sibling of the input). **Render it and look.**

Fastest authoritative probe — a throwaway `*.dom.test.ts` in the test package's
`__tests__/` (jsdom is the _stricter_ selector engine, so what passes here passes
in real browsers):

```ts
import { createTestEngine } from '@atomic-testing/react-18';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { <Driver> } from '@atomic-testing/component-driver-<lib>';
import React from 'react';
import { <Example> } from '../src/examples/<c>/<Example>.examples';

const parts = { x: { locator: byDataTestId('<id>'), driver: <Driver> } } satisfies ScenePart;

it('probe', () => {
  const engine = createTestEngine(React.createElement(<Example>), parts);
  const el = document.querySelector('[data-testid="<id>"]');
  console.log('OUTER=', el?.closest('label')?.outerHTML ?? el?.outerHTML);
  // Probe the candidate selector AND whether the engine supports it (e.g. :has()):
  try { console.log('SEL=', document.querySelector('<candidate selector>')?.textContent); }
  catch (e) { console.log('SEL THREW=', (e as Error).message); }
  return engine.cleanUp();
});
```

Run it: `cd package-tests/component-driver-<lib>-test && npx jest _probe.dom.test.ts`.
**Delete the probe when done.** (Chrome DevTools / `mui-mcp` MCP servers may be
configured but absent from the session — jsdom is always available and is the
target that matters most.)

## Phase 2 — Choose a portable locator (accessibility-first)

A locator resolves to **one CSS string** (`locatorUtil.toCssSelector`) that runs
in `querySelector` (jsdom) and `page.locator()` (Playwright). Prefer relationships
that are stable across library versions and semantic over class-coupled. In order:

1. **Direct attribute / role** on the element — `byRole`, `byAttribute`,
   `byInputType`, `byValue`, `byChecked`. Prefer role/aria over `class`.
2. **Explicit a11y link** (`for`↔`id`, `aria-labelledby`↔`id`): use
   `byLinkedElement().onLinkedElement(...).extractAttribute('for').toMatchMyAttribute('id')`
   — it extracts an attribute off one element and matches it on another, resolving
   to a plain `byAttribute` selector (no special CSS). See
   `package-tests/component-driver-html-test/src/examples/form/LinkedElement.suite.ts`.
3. **Descendant** of the driver root — chain a `byCssSelector('...')` part (it
   appends as a descendant). Mirror `TextFieldDriver`'s `label`/`helperText` parts.
4. **Ancestor / sibling outside the subtree** (e.g. MUI's implicit wrapping
   `<label>`): CSS can only go "up" via `:has()`. Re-root at the ancestor matched
   against _this_ element, **keeping the surrounding scope** so sibling instances
   never collide:

   ```ts
   const chain = this.locator; // PartLocator is always a chain, no normalization needed
   const self = chain[chain.length - 1].selector; // this element's own selector
   const target = locatorUtil.append(
     chain.slice(0, -1), // keep engine-root scope
     byCssSelector(`<ancestor>:has(${self}) <descendant>`) // e.g. `label:has(${self})`
   );
   ```

   `:has()` is supported by jsdom's nwsapi (≥2.2) and all three Playwright engines
   (Chromium/Firefox/WebKit) — but **verify in Phase 1**, don't assume.

5. **Portal / outside-the-tree content** (Dialog, Menu, Drawer): override
   `overriddenParentLocator()` + `overrideLocatorRelativePosition()` to re-root
   (see `DialogDriver`/`MenuDriver`).

**Disambiguation rule:** render the example with **two instances** and assert each
returns its own value — that's how you catch a too-broad selector. When you re-root
(option 4/5) you drop the parent scope, so pin the match with the element's own
selector, not the full chain.

## Phase 3 — Implement

- Add the method on the driver with a JSDoc comment that says **why** (the DOM
  relationship), not just what. TypeDoc regenerates `docs/docs/api/**` from it.
- Return `Optional<string>` (= `string | undefined`) for "read text" methods, to
  match `TextFieldDriver.getLabel`. Guard with `interactor.exists(locator)` and
  return `undefined` when the relationship is absent (e.g. no label).
- `getLabel`/`getText` is **not** an interface method — adding it needs no
  interface change. State accessors map to existing `interactor` ops
  (`hasAttribute`, `hasCssClass`, `getAttribute`, `isDisabled`, …).
- Only if a genuinely new _interaction_ is needed (e.g. keyboard Arrow/Home for
  sliders) do you touch the `Interactor` interface — then you must implement it in
  **every** interactor (DOM/React/Vue/Playwright) and prove it via the HTML driver
  - `component-driver-html-test`. This is the expensive path; avoid if a locator works.
- **Changing an existing primitive's behavior is riskier than adding one** — it
  silently re-routes every driver that already calls it, not just the one you're
  motivated by (a picker-motivated `pressKey` tweak broke Angular Material
  `MatSelect`/`MatAutocomplete`). Grep all call sites, **gate the new behavior to the
  specific case that needs it** rather than changing the default path, and add the
  affected consumer packages to Phase 5.

## Phase 4 — Tests (shared suite, runs in both worlds)

Add tests to the existing `*.suite.ts` (destructure the assertions you need:
`assertEqual`, `assertTrue`, `assertFalse`, … — both adapters map `assertEqual`
to `toEqual`, so `undefined` compares fine). Cover: the happy path, the
**two-instance disambiguation**, and the **absent** case (e.g. a bare component
with no label → `undefined`). The suite feeds both `.dom.test.ts` and `.e2e.test.ts`
automatically — no per-adapter edits.

## Phase 5 — Verify (the non-negotiable part)

**If you changed a shared `Interactor`/`DOMInteractor` primitive** (not just added a
driver method), verification is not just this package: run the **full** suites — never
a name-filtered subset (`vitest run Foo` skips the sibling `Bar` suite in the same
package) — of **every** consumer package, **each per-major variant** (`-v20/21/22`,
`-x-v6/7/8/9` are separate CI jobs), including the browser-mode Angular Material suites
(`CHROMIUM_EXECUTABLE=/opt/pw-browsers/chromium npx vitest run`). "Green in the package
I edited" is not "green in CI."

**DOM (jsdom) — rebuild first.** Jest resolves workspace deps from **built
`dist/`** (`jest.config.base.js` `moduleNameMapper` → `dist/index.cjs`), so source
edits are invisible until you build:

```bash
cd packages/component-driver-<lib> && pnpm run build           # tsdown → dist
cd package-tests/component-driver-<lib>-test && npx jest <Name>Driver.dom.test.ts
```

**E2E (Playwright) — all three browsers** (`CLAUDE.md` requires it). Gotchas, in
the order they bite:

- **Browsers**: `npx playwright install chromium firefox webkit` (first time only).
- **Dev server**: `webServer` is commented out → start it yourself. Vite is
  `strictPort` on a per-package port (v5→5115, v6→5116, v7→5117). The Playwright
  `baseURL` must equal that port — **clone leftovers get this wrong** (v7's was
  stale at 5116). Fix the config to match.
- **React duplication**: if the app shows a blank `#root` and the console throws
  _"Invalid hook call … more than one copy of React" / "reading 'useContext' of
  null"_, add `resolve.dedupe: ['react','react-dom']` to the package's
  `vite.config.ts`, then restart Vite with `rm -rf node_modules/.vite`.
- **Reporter**: the default `html` reporter hangs serving a report (no stdout in a
  headless run). Use `--reporter=list` and redirect to a file.
- **Timeout**: the per-test timeout is a tight 3s; a _cold_ Vite first-compile can
  blow it. If pre-existing tests time out at the wall, the app likely isn't
  rendering (see React-dup above), not your code.

```bash
# start server (background), confirm it renders, then run:
pnpm start > /tmp/vite.log 2>&1 &        # note the actual port it prints
npx playwright test --reporter=list <Name>Driver > /tmp/e2e.log 2>&1; echo "exit=$?"
```

Sanity-check the live page before blaming tests: a tiny `@playwright/test` script
(run from inside the package so it resolves) that `goto`s the `url` and logs
`#root` innerHTML length + `pageerror`s. An empty `#root` with auto-waiting
locators all hitting the 30s wall ≠ a locator bug — it's a dead app.

## Phase 6 — Static checks & close-out

```bash
cd packages/component-driver-<lib> && npx tsc --noEmit           # typecheck (some pkgs lack the script)
npx oxfmt --list-different <changed files>                       # format (empty = clean)
npx oxlint <changed dirs>                                        # lint (exit 0 = clean)
```

Definition of done: jsdom suite green **after a build**; e2e green on
chromium+firefox+webkit; `tsc`/`oxfmt`/`oxlint` clean; probe deleted; JSDoc
written; any harness fixes (ports, dedupe, missing `check:type` script) called out
to the user since this repo isn't under git here. Cross-version parity (v5/v6/v7
often share a gap) is a deliberate scope call — note it, don't auto-expand.
