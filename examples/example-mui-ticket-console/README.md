# Example: MUI 9 + MUI-X 9 ticket triage console

A data-dense **support ticket triage console** built on **MUI Material v9 + MUI-X v9** and **React 19**, tested with **Vitest** (jsdom) and **Playwright** (3 browsers) through [atomic-testing](https://github.com/atomic-testing/atomic-testing) component drivers.

It is a sibling to [`example-mui-signup-form`](../example-mui-signup-form), and exists to show three things the library is for:

1. **Driver composability** — small shipped drivers compose into page-object drivers (`FilterBarDriver`, `TicketGridDriver`, `TicketEditorDriver`, `TeamNavDriver`), which compose again into one top-level `TicketConsoleDriver`.
2. **DOM/E2E dedup** — the *same* composed drivers, the *same* `parts` scene, and the *same* scenario flows are imported by both the Vitest DOM tests and the Playwright E2E specs. The only thing that differs is how the `TestEngine` is built.
3. **Readability** — a test reads like a person triaging tickets: *filter to Open due this week, open the first ticket, reassign it to me, save, expect a success toast.*

## The scenario

```
┌─ Tickets ───────────────────────────────────────┐
│ [🔎 search] [Assignee ▾] [Status ▾] [Due ▭–▭]   │  ← FilterBar
│ [ All | Mine | Overdue ]  (Tabs)                 │
├──────────────┬──────────────────────────────────┤
│ ▾ Web        │  # │ Title    │ Assignee │ Due │⋯ │
│   Bugs       │ 12 │ Login... │ Ana      │ Mon │⋯ │  ← MUI-X DataGrid
│   Features   │ 13 │ Crash... │ Bo       │ Tue │⋯ │
│ ▾ Mobile     │ 14 │ Slow...  │ —        │ Wed │⋯ │
│   Crashes    │                       11 tickets   │
│   Triage     │  row / row-menu → Dialog → Snackbar│
│ (TreeView)   │                                    │
└──────────────┴──────────────────────────────────┘
```

- **Team / queue sidebar** — a MUI-X `SimpleTreeView`; selecting a queue filters the grid.
- **Filter bar** — free-text search (`TextField`), assignee (`Autocomplete`), status (`Select`), and a due-date range (two `DesktopDatePicker`s).
- **Views** — `Tabs`: All / Mine / Overdue.
- **Grid** — the **community** MUI-X `DataGrid` of tickets, with a per-row action `Menu` (Edit / Assign to me / Close).
- **Editor** — a `Dialog` with title `TextField` (required), status + priority `Select`s, assignee `Autocomplete`, label `Chip`s, a "watching" `Switch`, and a due-date `DatePicker`.
- **Feedback** — a `Snackbar` on save.

All state is client-side. The seed (`src/data`) is a small fixed fixture and the app uses a **fixed reference "today"** (`2026-06-15`), so "Due this week" / "Overdue" and every assertion are deterministic across the DOM and E2E runs.

## The dedup story (the headline)

The DOM test and the E2E spec are thin adapters around shared modules:

| | DOM (`src/__tests__/ticketConsole.test.tsx`) | E2E (`e2e/ticketConsole.spec.ts`) |
| --- | --- | --- |
| Engine | `createTestEngine(<App/>, consoleParts)` from `@atomic-testing/react-19` | `createTestEngine(page, consoleParts)` from `@atomic-testing/playwright` |
| Scene | `consoleParts` (imported) | `consoleParts` (imported) |
| Flows | `triageFlow`, `emptyQueueFlow`, … (imported) | the same functions (imported) |

Each scenario in [`src/testing/scenarios.ts`](src/testing/scenarios.ts) is written **once** as a flow over `TicketConsoleDriver`. For example:

```ts
export async function triageFlow(console: TicketConsoleDriver, assert: Assert) {
  await console.waitUntilReady();
  await console.filterBar.filterByStatus('Open');
  await console.filterBar.setDueRange(week.from, week.to);
  await console.grid.openRow(0);
  await console.editor.setValue({ assignee: 'Me', priority: 'High' });
  await console.editor.save();
  assert.includes(await console.toast.getLabel(), 'saved');
  assert.equal(await console.grid.getAssignee(0), 'Me');
}
```

The composed drivers live next to the components they drive, in `src/components/<feature>/<Feature>Driver.ts`.

## Running it

```bash
pnpm install            # standalone install (its own lockfile; see "Dependency wiring")
pnpm dev                # manual smoke at http://localhost:8090
pnpm test:dom           # Vitest (jsdom)
pnpm test:e2e:chrome    # Playwright, Chromium only (fast iteration)
pnpm test:e2e           # Playwright on chromium + firefox + webkit (webServer auto-starts vite)
pnpm check:type         # tsc --noEmit
```

## Notes for driver authors

### Two driver gaps were filled upstream

This scenario needs to *set* a date picker and *select* a tree item — capabilities the shipped MUI-X v9 drivers did not have. They were added to the monorepo as general, reusable driver methods (not example-local workarounds):

- `DesktopDatePickerDriver.setValue(date)` / `pickDate('yyyy-mm-dd')` — operates the calendar popup (open → page to the month → click the day), the one write path that behaves identically in jsdom and in real browsers.
- `SimpleTreeViewDriver.selectItem(itemId)` — clicks the item's content row to select it.

Because this example consumes those methods, it depends on `@atomic-testing/*@^0.90.0`.

### Community vs. premium DataGrid

The example uses the **community** `@mui/x-data-grid` (no license watermark). The shipped `DataGridPremiumDriver` drives it unchanged — Premium, Pro, and Community render the same grid DOM (`role="row"`/`"gridcell"`, `data-rowindex`/`data-field`). Virtualization is disabled and the page size is larger than the seed, so the grid renders every row in jsdom exactly as in a browser and `getRowCount` matches across both.

## Dependency wiring

This example is a **standalone pnpm workspace** (its own `pnpm-lock.yaml`, intentionally not a member of the monorepo's root workspace), mirroring a real consumer install.

It pins `@atomic-testing/*@^0.90.0`, resolved straight from the npm registry.
