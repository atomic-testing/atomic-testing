# Atomic testing example — shadcn/ui workspace settings

A standalone example app built on **real, unmodified [shadcn/ui](https://ui.shadcn.com/) CLI
output** (style `radix-vega`, Radix engine) showing how
[atomic-testing](https://www.atomic-testing.dev/) lets you write **one set of page-object
drivers** and run the **same flow** in both a fast jsdom unit test (Vitest) and a real
cross-browser end-to-end test (Playwright).

It is a sibling to [`example-astryx-workspace`](../example-astryx-workspace) and
[`example-mui-signup-form`](../example-mui-signup-form), and consumes `@atomic-testing/*`
straight from npm — exactly as a real consumer would.

## The pain point this example exists for

jsdom does not implement `Element.prototype.hasPointerCapture` (the whole Pointer Events
capture API is absent — [jsdom#2527](https://github.com/jsdom/jsdom/issues/2527), still
open). Radix's `Select` trigger unconditionally calls it in its `onPointerDown` handler, so
under Testing Library + jsdom the **very first click on any Radix/shadcn `<Select>` throws
`target.hasPointerCapture is not a function`** and the dropdown never opens — the
widely-reported bug that makes people give up on unit-testing shadcn Selects. (Its browser
sibling — Playwright clicks closing the Select as fast as they open it — was closed
**Won't Fix** by Radix as by-design pointer behaviour.) A second gap, `scrollIntoView`,
throws in the very same open gesture.

**This example's [`vitest.setup.ts`](vitest.setup.ts) polyfill set + the shipped drivers
make the same Select open/enumerate/select-by-label flow pass in jsdom AND in a real
browser, from one test definition.** The polyfills are inert, factually-accurate stubs
(jsdom never captures a pointer, so `hasPointerCapture` honestly answers `false`); the
drivers assert state through ARIA/`data-` attributes, which jsdom renders faithfully. Real
capture/scroll/layout behaviour is covered by the Playwright run of the very same flows.

## The app

A small "Workspace settings" dashboard (`App.tsx` + two feature components), built only from
the generated `Button`, `Dialog`, `DropdownMenu`, `Input`, `Select`, and `Tabs`:

- A header with an **Account `DropdownMenu`** (Profile / Sign out, split by a separator) that
  updates a visible session-status line.
- **`Tabs`**: Profile and Notifications panels.
- Profile tab: a display-name **`Input`**, a timezone **`Select`** (5 options), and a Save
  **`Button`** surfacing a visible saved-confirmation line.
- A destructive "Delete workspace" **`Button`** opening a confirm **`Dialog`**
  (Cancel / Confirm; `Escape` closes it).

All state is plain, deterministic React state — no backend — so DOM and E2E assertions agree
byte-for-byte.

> **`src/components/ui/` is untouched `npx shadcn add` output** (style `radix-vega`). Every
> `data-testid` anchor lives on a usage site — the shadcn wrappers spread props through to
> the Radix primitives, so no generated file needed editing.

## The point: dedup at the driver layer + readable tests

Shipped shadcn drivers are composed into **page-object drivers** ([`src/testing/`](src/testing)),
composed again into one top-level `WorkspaceDriver`:

```text
WorkspaceDriver
├── AccountMenuDriver    HTMLButtonDriver + DropdownMenuDriver + HTMLElementDriver
│                                            open / choose('Sign out') / getStatus
├── TabsDriver           (shipped)           selectByLabel / getSelectedLabel / getPanelText
├── ProfileFormDriver    HTMLTextInputDriver + SelectDriver + HTMLButtonDriver
│                                            setValue({displayName, timezone}) / save / getSaveStatus
└── DangerZoneDriver     HTMLButtonDriver + DialogDriver{cancel, confirm} + HTMLElementDriver
                                             openDialog / cancel / confirmDelete / dialog.closeByEscape
```

Because the drivers carry the behaviour, the tests read like a person using the app:

```ts
await workspace.profile.setValue({ displayName: 'Grace Hopper', timezone: 'London' });
await workspace.profile.save();
expect(await workspace.profile.getSaveStatus()).toBe('Saved — Grace Hopper (London)');
```

**The dedup story:** the DOM spec ([`src/__tests__/workspace.test.tsx`](src/__tests__/workspace.test.tsx))
and the E2E spec ([`e2e/workspace.spec.ts`](e2e/workspace.spec.ts)) import the **same**
[`workspaceParts`](src/testing/workspaceParts.ts) scene and the **same** composed drivers.
The only difference is how the engine is built:

|                     | Engine construction                                                           |
| ------------------- | ----------------------------------------------------------------------------- |
| DOM (Vitest, jsdom) | `createTestEngine(<App />, workspaceParts)` — from `@atomic-testing/react-19` |
| E2E (Playwright)    | `createTestEngine(page, workspaceParts)` — from `@atomic-testing/playwright`  |

Two portal recipes come for free from the shipped drivers: `DialogDriver` and
`DropdownMenuDriver` re-root themselves at their `role="dialog"`/`role="menu"` content on
`document.body`, so the scene simply declares the `data-testid` you put on
`DialogContent`/`DropdownMenuContent`. Note there is deliberately no backdrop-click close in
the Dialog flow — Radix's overlay carries no distinguishing ARIA, so `closeByEscape` is the
portable dismissal (see the [Radix driver coverage guide](https://www.atomic-testing.dev/docs/guides/radix-driver-coverage)).
The Select is **label-based** (`selectByLabel`, `getSelectedLabel`) because Radix renders no
`data-value` on its items.

## Commands

| Command                | Description                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`         | Install deps (standalone — this package has its own lockfile and is outside the repo's pnpm workspace)                     |
| `pnpm dev`             | Run the app at <http://localhost:8091> (a dedicated port, distinct from every other app in the repo; override with `PORT`) |
| `pnpm test:dom`        | Vitest (jsdom) — `src/**/__tests__/*.test.tsx`                                                                             |
| `pnpm test:e2e:chrome` | Playwright on Chromium (fast iteration; the Vite server auto-starts)                                                       |
| `pnpm test:e2e`        | Playwright on Chromium, Firefox, and WebKit                                                                                |
| `pnpm check:type`      | `tsc --noEmit`                                                                                                             |

## Stack

`react@^19.2` · `radix-ui@^1.6` · shadcn CLI output (Tailwind v4, `lucide-react`) ·
`@atomic-testing/{core,dom-core,react-19,playwright,component-driver-html,component-driver-shadcn-v1}@^0.92.0`
· `vite` · `vitest@^4` · `@playwright/test@^1.61`.

> The shadcn driver surface used here is gap-free — every action these scenarios need is a
> shipped driver method (`@atomic-testing/component-driver-shadcn-v1` re-exports the Radix v1
> drivers, since shadcn components are styled Radix primitives with identical DOM). This
> example was verified on Chromium; the Firefox and WebKit projects are configured in
> `playwright.config.ts` but need an environment where Playwright can download those browsers.
