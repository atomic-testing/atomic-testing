# Atomic testing example — Astryx AI chat + admin workspace

A standalone example app built on the [Astryx design system](https://www.npmjs.com/package/@astryxdesign/core)
(`@astryxdesign/core`, React 19) showing how [atomic-testing](https://www.atomic-testing.dev/) lets you
write **one set of page-object drivers** and run the **same flow** in both a fast jsdom unit
test (Vitest) and a real cross-browser end-to-end test (Playwright).

It is a sibling to [`example-mui-signup-form`](../example-mui-signup-form) and consumes
`@atomic-testing/*` and `@astryxdesign/*` straight from npm — exactly as a real consumer would.

## The app

One [`AppShell`](https://www.npmjs.com/package/@astryxdesign/core) with a side nav that switches
between two co-equal sections (routed with `react-router-dom`):

- **Chat** (`/`) — a `ChatLayout` message log with a docked `ChatComposer`. Sending appends your
  message plus a **deterministic** assistant reply that includes a tool-call group (no backend, so
  DOM and E2E assertions are stable). A header `Selector` picks the model; **⌘K** opens a
  `CommandPalette` ("New chat", "Clear chat", "Open settings").
- **Admin** (`/admin`) — a settings console: a `TabList` (General / Notifications / Appearance) over
  `Field` / `TextInput` / `SegmentedControl` / `CheckboxList` / `RadioList` / `Switch` / `Selector` /
  `DateInput`, an unsaved-changes `Banner`, a Save `Button` → `Toast`, and a "Delete workspace"
  `Button` → confirm `AlertDialog`.

## The point: dedup at the driver layer + readable tests

Shipped Astryx drivers are composed into **page-object drivers** ([`src/testing/`](src/testing)),
composed again into one top-level `WorkspaceDriver`:

```text
WorkspaceDriver
├── WorkspaceShellDriver   AppShellDriver + SideNavDriver + SideNavItemDriver   gotoChat / gotoAdmin / getCurrentSection
├── ChatPanelDriver        ChatLayout + ChatMessageList + ChatComposer + Selector + ChatToolCalls
│                                                          send / getLastAssistantText / getToolCallCount / selectModel
├── AdminSettingsDriver    TabList + the form + Banner + Button + Toast + AlertDialog
│                                                          setValue(SettingsModel) / save / hasUnsavedBanner / deleteWorkspace
└── CommandBarDriver       CommandPaletteDriver            open / run / getCommands
```

Because the drivers carry the behaviour, the tests read like a person using the app:

```ts
await workspace.gotoAdmin();
await workspace.admin.setValue({ orgName: 'Globex', plan: 'Pro', channels: ['Email'], beta: true });
await workspace.admin.save();
expect(await workspace.admin.getToastMessage()).toMatch(/saved/i);
```

**The dedup story:** the DOM spec ([`src/__tests__/workspace.test.tsx`](src/__tests__/workspace.test.tsx))
and the E2E spec ([`e2e/workspace.spec.ts`](e2e/workspace.spec.ts)) import the **same**
[`workspaceParts`](src/testing/workspaceParts.ts) scene and the **same** composed drivers. The only
difference is how the engine is built:

| | Engine construction |
| --- | --- |
| DOM (Vitest, jsdom) | `createTestEngine(<App />, workspaceParts)` — from `@atomic-testing/react-19` |
| E2E (Playwright) | `createTestEngine(page, workspaceParts)` — from `@atomic-testing/playwright` |

## Commands

| Command | Description |
| --- | --- |
| `pnpm install` | Install deps (standalone — this package has its own lockfile and is outside the repo's pnpm workspace) |
| `pnpm dev` | Run the app at <http://localhost:5173> (override with `PORT`) |
| `pnpm test:dom` | Vitest (jsdom) — `src/**/__tests__/*.test.tsx` |
| `pnpm test:e2e:chrome` | Playwright on Chromium (fast iteration; the Vite server auto-starts) |
| `pnpm test:e2e` | Playwright on Chromium, Firefox, and WebKit |
| `pnpm check:type` | `tsc --noEmit` |

## Stack

`react@^19.2` · `react-router-dom@^7` · `@astryxdesign/core@^0.1.2` +
`@astryxdesign/theme-neutral@^0.1` · `@atomic-testing/{core,dom-core,react-19,playwright,component-driver-html,component-driver-astryx}@^0.89.0`
· `vite` · `vitest@^4` · `@playwright/test@^1.61`.

> The Astryx driver surface used here is gap-free — every action these scenarios need is a shipped
> driver method. The `vitest.setup.ts` polyfills the browser overlay APIs jsdom lacks (Popover,
> `<dialog>` modal methods, `ResizeObserver`/`IntersectionObserver`, `matchMedia`); real overlay
> behaviour is covered by the Playwright run.
