---
name: scaffold-test-driver
description: >
  Use when creating atomic-testing drivers for an app's own components — e.g.
  "write tests for <Component>", "test this page", "I need a driver for the
  settings panel", "create a page object for checkout", "our wizard has no
  driver coverage". Encodes the end-to-end workflow: inventory what's already
  covered by shipped @atomic-testing drivers, decompose the component/page with
  the six-rule algorithm (so you never emit a god driver), probe the real DOM,
  pick a portable locator off the escalation ladder, implement with the fixed
  composite-driver idioms, and verify in every runner the project configures.
---

# Scaffolding a test driver tree for your own component or page

The layer stack is `TestEngine → ComponentDriver → Interactor → PartLocator`. A
driver method is just semantic sugar over `this.interactor.<op>(locator)`, where
`locator` is CSS resolved to **one selector string** and run identically by every
interactor (jsdom for DOM runners, `page.locator()` for Playwright). The whole
game is: **decompose the UI into the right driver tree, express each part as one
portable CSS relationship, and prove it in every environment the project runs.**

This skill targets an app that has `@atomic-testing/*` installed as a normal npm
dependency (usually scaffolded by `create-atomic-testing`). Everything runs with
the project's own commands — there is no library to rebuild.

Surface ambiguities before building (batches of ≤4 questions). Keep the diff
surgical; name adjacent smells, don't silently fix them.

---

## Phase 0 — Locate & classify the target

1. **Read the target component's source** (the `.tsx`/`.vue`/component file and
   its children). You are decomposing the component tree, not the rendered DOM —
   the DOM comes later, in the probe.
2. **Inventory the installed driver packages.** Check `package.json` for
   `@atomic-testing/component-driver-*` (`-html`, `-mui-v*`, `-shadcn-*`,
   `-angular-material-*`, `-primevue-*`, …) and skim each package's exports
   (`node_modules/@atomic-testing/component-driver-<lib>/dist/index.d.ts` or its
   docs). Every node already covered by a shipped driver is a leaf you will
   **reuse, not reinvent**.
3. **Detect the project's conventions before choosing your own:**
   - Driver file placement: an existing `src/testing/` directory, or
     `<Component>Driver.ts` colocated next to components? Follow whichever
     exists. If neither: colocate feature drivers next to their component and
     put the page-level scene + page-object driver in `src/testing/`.
   - Test-id constants: a shared `AppDataTestId.ts` / `<Feature>DataTestId.ts`
     module imported by **both** the component and the driver, so a rename is a
     compile error instead of a silent locator break. If the project lacks one,
     create it — never inline string literals in two places.
   - Configured runners: a Vitest/Jest config (DOM), a `playwright.config.*`
     (E2E, note its `projects` — each browser is a separate verification
     target), and which `createTestEngine` the project imports
     (`@atomic-testing/react-18|react-19|vue-3|angular-*|playwright`).

## Phase 1 — Decompose (the six-rule algorithm)

Walk down from the target root and decide, **per node, in this order** — the
first rule that matches wins:

1. **Already covered by a shipped driver?** → **Reuse it.** Stop recursing here.
   This is the single highest-leverage rule: every leaf that's a known
   design-system primitive terminates the walk. Never generate a driver for
   something `component-driver-html` or your design-system package already ships.
2. **Variable-length collection of identically-shaped children** (list, table
   rows, menu items, chat messages, search results)? → **`ListComponentDriver`**.
   Recurse only into the *item* shape (one `itemClass`) — never into
   "item1, item2, item3" as separate named parts.
3. **Chrome fixed, content varies by call site** (dialog body, tab panel,
   slide-over hosting a different form per usage)? → **`ContainerDriver`**, with
   the caller threading `content` per usage in *its* ScenePart — the container
   driver's own file knows nothing about any specific content.
4. **Semantically independent, nameable feature** — it has its own component
   file, it bundles a domain-level operation (`fillShippingInfo`, `send`,
   `save`), or it plausibly appears in more than one place? → **Factor it into
   its own composite driver class, its own file.** Recurse into *its* children
   with these same rules, one level down.
5. **Otherwise** — a small fixed cluster of primitives with no reuse potential
   and no domain operation of its own (a label + icon + close button that only
   ever appear together, once) → **inline as plain nested `ScenePart` entries**
   on the parent. Don't manufacture a class that will never be reused or
   addressed as a unit.
6. **A page or route always terminates in exactly one root `ScenePart` entry**
   pointing to **one thin page-object driver** that is nothing but a composition
   of the rule-4 feature drivers — never a flat bag of everything on the page.
   This is the rule most often skipped under time pressure; a flat
   seven-part scene of unrelated step forms is the canonical failure.

**Concrete extraction triggers, not vibes:**

- **More than ~7–10 direct parts on one driver** is your own signal to stop and
  extract a child driver — don't leave it for a human reviewer to notice.
- A driver mixing parts from **more than one unrelated domain concern** (header
  controls + form fields) is a decomposition failure regardless of part count.
- A component that could plausibly render **twice on the same page** (list item,
  repeated card, a form used in both a modal and a full page) always gets its
  own file the first time, even if only one instance exists today.

## Phase 2 — Plan checkpoint (before writing any file)

Produce the plan as a tree diagram, each node tagged with its rule:

```text
CheckoutPage                     → rule 6: page object (1 root ScenePart entry)
├── shippingForm                 → rule 4: new ShippingFormDriver (own file)
│   ├── street / city / zip      → rule 1: reuse HTMLTextInputDriver
│   └── country                  → rule 1: reuse <ds> SelectDriver
├── cartSummary                  → rule 4: new CartSummaryDriver
│   └── lineItems                → rule 2: ListComponentDriver(itemClass: LineItemDriver)
├── couponDialog                 → rule 3: reuse <ds> DialogDriver (ContainerDriver), content per usage
└── submit                       → rule 1: reuse <ds> ButtonDriver (inline, rule 5 placement)
```

**Stop and show this plan to the user; get an explicit go-ahead before
generating files.** This is the root `CLAUDE.md`'s "scrutinize first, build
second" rule applied where it pays most: a wrong decomposition is cheap to fix
now and expensive once five files reference it.

## Phase 3 — Probe the real DOM (don't guess)

Design systems rarely render what you'd assume (MUI puts `data-testid` on a
wrapping root span, not the `<input>`; Radix portals menus to `<body>`).
**Render it and look**, per node that needs a new driver.

Fastest authoritative probe — a throwaway test in the project's own DOM runner
(jsdom is the *stricter* selector engine, so what passes here passes in real
browsers):

```tsx
// _probe.test.tsx — THROWAWAY, delete before committing
import { createTestEngine } from '@atomic-testing/react-19'; // whichever the project uses
import { it } from 'vitest'; // or @jest/globals

import { SettingsPanel } from '../src/components/SettingsPanel';

it('probe', async () => {
  const engine = createTestEngine(<SettingsPanel />, {});
  const el = document.querySelector('[data-testid="settings-panel"]');
  console.log('OUTER=', el?.outerHTML);
  // Probe the candidate selector AND whether the engine supports it (e.g. :has()):
  try { console.log('SEL=', document.querySelector('<candidate selector>')?.textContent); }
  catch (e) { console.log('SEL THREW=', (e as Error).message); }
  await engine.cleanUp();
});
```

Run it with the project's runner: `npx vitest run _probe` / `npx jest _probe`.
If the project is E2E-only, probe with a tiny Playwright spec that `goto`s the
page and logs `outerHTML` instead. **Delete the probe when done.**

Since this is the user's own app, you also have an option a driver for a
third-party library never has: **add a `data-testid` to the component source**
(via the shared test-id constants module). Prefer that over a clever selector
when you own the markup.

## Phase 4 — Choose portable locators (accessibility-first)

A locator resolves to **one CSS string** that runs in `querySelector` (jsdom)
and `page.locator()` (Playwright). Prefer relationships that are stable across
library versions and semantic over class-coupled. In order:

1. **Direct attribute / role** on the element — `byDataTestId` (backed by the
   constants module), `byRole`, `byAriaLabel`, `byAttribute`, `byInputType`,
   `byValue`, `byChecked`. Prefer role/aria/test-id over `class`.
2. **Explicit a11y link** (`for`↔`id`, `aria-labelledby`↔`id`):
   `byLinkedElement().onLinkedElement(...).extractAttribute('for').toMatchMyAttribute('id')`
   — extracts an attribute off one element and matches it on another, resolving
   to a plain attribute selector (no special CSS).
3. **Descendant** of the driver root — chain a `byCssSelector('...')` part (it
   appends as a descendant of the parent locator).
4. **Ancestor / sibling outside the subtree** (e.g. an implicit wrapping
   `<label>`): CSS can only go "up" via `:has()`. Re-root at the ancestor
   matched against *this* element, **keeping the surrounding scope** so sibling
   instances never collide:

   ```ts
   const chain = this.locator; // PartLocator is always a chain, no normalization needed
   const self = chain[chain.length - 1].selector; // this element's own selector
   const target = locatorUtil.append(
     chain.slice(0, -1), // keep engine-root scope
     byCssSelector(`label:has(${self}) <descendant>`)
   );
   ```

   `:has()` is supported by jsdom's nwsapi (≥2.2) and all three Playwright
   engines — but **verify in the Phase 3 probe**, don't assume.
5. **Portal / outside-the-tree content** (Dialog, Menu, Drawer, Toast): address
   it from the document root in the ScenePart —
   `byDataTestId(id, 'Root')` — or, for a reusable driver class, override
   `static overriddenParentLocator()` / `static overrideLocatorRelativePosition()`.

**Disambiguation rule (hard requirement, not an afterthought):** render **two
instances** of the component and assert each driver returns its own value —
that's how you catch a too-broad selector. When you re-root (rung 4/5) you drop
the parent scope, so pin the match with the element's own selector, not the
full chain.

## Phase 5 — Implement

Every generated composite driver carries these fixed idioms:

```ts
import {
  AssertScenePlaceableDriver,
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';
import { ButtonDriver, TextFieldDriver } from '@atomic-testing/component-driver-<ds>';

import { ShippingFormDataTestId as T } from './ShippingFormDataTestId';

const parts = {
  street: { locator: byDataTestId(T.street), driver: TextFieldDriver },
  submit: { locator: byDataTestId(T.submit), driver: ButtonDriver },
} satisfies ScenePart;

export class ShippingFormDriver extends ComponentDriver<typeof parts> {
  // CONTRAVARIANCE RULE: the option parameter must be the EMPTY-default
  // Partial<IComponentDriverOption> — NOT Partial<IComponentDriverOption<typeof parts>>.
  // Constructor params are checked contravariantly, so the "natural" signature
  // makes the class unplaceable in a parent ScenePart. Hardcode `parts` in the body.
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  /** Read methods return Optional<string>, guarded by exists() for the absent case. */
  async getStreet(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(this.parts.street.locator))) {
      return undefined;
    }
    return this.parts.street.getValue() ?? undefined;
  }

  get driverName(): string {
    return 'ShippingFormDriver';
  }
}

// One-line compile-time lock on the contravariance rule — if the constructor
// signature regresses, the type-check fails here, not at a distant call site.
type _Lock = AssertScenePlaceableDriver<typeof ShippingFormDriver>;
```

- **Rule-2 (list) placement** — declare `ListComponentDriver` in a scene with a
  required `option`, or subclass it with a defaulted option like the shipped
  drivers do:

  ```ts
  lineItems: {
    locator: byDataTestId(T.lineItems),
    driver: ListComponentDriver<LineItemDriver>,
    option: { itemClass: LineItemDriver, itemLocator: byRole('listitem') },
  },
  // read via getItemByIndex / getItemByLabel / getItems / getItemCount
  ```

- **Rule-3 (container) placement** — the content is threaded at the *call
  site's* ScenePart, never inside the container driver's file:

  ```ts
  const dialogContent = {
    form: { locator: byDataTestId(T.couponForm), driver: CouponFormDriver },
  } satisfies ScenePart;

  couponDialog: {
    locator: byDataTestId(T.couponDialog, 'Root'), // portals to <body>
    driver: DialogDriver<typeof dialogContent>,
    option: { content: dialogContent },
  },
  // read via engine.parts.couponDialog.content.form
  ```

- **Dynamically-constructed children** (a per-label chip getter, an item
  accessor no ScenePart can pre-declare): pass `this.commutableOption` — the
  shared driver-tree context minus the parent's own `parts` — instead of
  re-deriving options:

  ```ts
  getLabelChip(label: string): ChipDriver {
    return new ChipDriver(
      locatorUtil.append(this.locator, byDataTestId(labelChipTestId(label))),
      this.interactor,
      this.commutableOption
    );
  }
  ```

- **Rule-6 page object** — thin: it composes the feature drivers and adds only
  flow-level conveniences (`gotoAdmin()`, `waitUntilReady()`), plus typed
  getters over `this.parts.*`. No leaf primitives at this level.
- Give every method a JSDoc that says **why** (the DOM relationship), not what.
- Export the root scene from one module (e.g. `src/testing/<page>Parts.ts`) so
  the DOM tests and E2E specs import the **same** `parts` object and drivers;
  only the engine construction differs per runner.

## Phase 6 — Verify (in every configured environment)

`@atomic-testing/*` ships prebuilt — there is nothing of the library to rebuild;
your own files are picked up directly.

1. **Type-check** with the project's own command (`npx tsc --noEmit` or its
   `check:type` script). The `AssertScenePlaceableDriver` locks fire here.
2. **DOM runner**: run the new tests with the project's DOM command
   (`npx vitest run <file>` / `npx jest <file>`).
3. **Every Playwright project** the config declares (`npx playwright test` runs
   all; a `--project=chromium` pass alone verifies one browser, not the rest).
   Start the dev server the way the project's config expects (`webServer` block
   or manually).
4. Confirm the **two-instance disambiguation** and **absent-case**
   (`undefined`-returning) tests actually pass — not merely exist.

Definition of done: plan approved by the user; probe deleted; every new locator
passed disambiguation; no driver exceeds ~7–10 direct parts without an
extraction; a page target has exactly one root ScenePart entry; type-check and
all configured runners green.

**Handoffs:** writing behavior tests against the finished tree is
`author-component-tests`; updating this tree after the UI changes is
`sync-test-driver`.
