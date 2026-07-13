---
id: decomposing-driver-trees
sidebar_label: Decomposing driver trees
sidebar_position: 1
---

# Decomposing a page into a driver tree

When you write drivers for your own app, the hard part is not any single driver —
it is deciding **how many drivers there are and how they nest**. Get that wrong
and you produce a _god driver_: one class with thirty parts spanning a header, a
form, a table, and a dialog, that every test must reach through and no test can
reuse. Get it right and a whole flow reads through one page object —
`workspace.chat.send('…')`, `workspace.gotoAdmin()` — while each feature stays a
small, independently reusable driver.

This guide is the narrative behind the
[`scaffold-test-driver`](https://github.com/atomic-testing/atomic-testing/tree/main/.claude/skills/scaffold-test-driver)
skill's decomposition algorithm. The examples are real: every snippet below is
lifted from a CI-green app under
[`examples/`](https://github.com/atomic-testing/atomic-testing/tree/main/examples).

## The six-rule algorithm

Walk down from the target (a page, a route, a rich component) and decide, **per
node, in this order** — the first rule that matches wins:

1. **Already covered by a shipped driver?** Reuse it and stop. Every leaf that is
   a known design-system primitive — a button, a text input, a select —
   terminates the walk. Never re-implement what `@atomic-testing/component-driver-html`
   or your design-system package already ships.
2. **A variable-length collection of identically-shaped children** (list, table
   rows, menu items, chat messages)? Model it with a
   [`ListComponentDriver`](../core-concepts.mdx#driver-types) and recurse only into
   the _item_ shape — never `item1`, `item2`, `item3` as separate named parts.
3. **Fixed chrome, caller-varying content** (a dialog whose body differs per
   usage)? Model it with a [`ContainerDriver`](../core-concepts.mdx#driver-types); the
   caller threads the `content` scene per usage, and the container's own file
   knows nothing about any specific interior.
4. **A semantically independent, nameable feature** — it has its own component
   file, bundles a domain operation (`save`, `send`, `fillShippingInfo`), or
   could plausibly appear more than once? Factor it into its **own composite
   driver class, in its own file**, and recurse into its children one level down.
5. **Otherwise** — a small fixed cluster of primitives with no reuse potential
   and no operation of its own — inline it as plain nested `ScenePart` entries on
   the parent. Don't manufacture a class no test will ever address as a unit.
6. **A page or route always terminates in exactly one root `ScenePart` entry**
   pointing to **one thin page-object driver** that is nothing but a composition
   of the rule-4 feature drivers — never a flat bag of everything on the page.

Rule 6 is the one skipped under time pressure, and skipping it is the canonical
failure — a flat seven-part scene of unrelated forms. The rest of this guide is
three apps that get it right and one that (deliberately) does not.

## Case study: a workspace shell (astryx)

[`example-astryx-workspace`](https://github.com/atomic-testing/atomic-testing/tree/main/examples/example-astryx-workspace/src/testing)
is the full shape in miniature. The scene has exactly **one** root entry (rule 6):

```ts
// workspaceParts.ts — the single scene shared by the DOM and E2E specs
export const workspaceParts = {
  workspace: { locator: byDataTestId(AppDataTestId.root), driver: WorkspaceDriver },
} satisfies ScenePart;
```

`WorkspaceDriver` is a thin page object. It owns no leaf primitives — its four
parts are all rule-4 feature drivers, and its own methods just delegate:

```ts
const parts = {
  shell: { locator: byDataTestId(AppDataTestId.shell), driver: WorkspaceShellDriver },
  chat: { locator: byDataTestId(AppDataTestId.chatSection), driver: ChatPanelDriver },
  admin: { locator: byDataTestId(AppDataTestId.adminSection), driver: AdminSettingsDriver },
  commandBar: { locator: byDataTestId(AppDataTestId.commandBar), driver: CommandBarDriver },
} satisfies ScenePart;

export class WorkspaceDriver extends ComponentDriver<typeof parts> {
  async gotoAdmin(): Promise<void> {
    await this.parts.shell.gotoAdmin();
  }
  get chat(): ChatPanelDriver {
    return this.parts.chat;
  }
  // …
}
```

One level down, `WorkspaceShellDriver` shows **rule 1** — it reuses shipped
astryx drivers (`AppShellDriver`, `SideNavDriver`, `SideNavItemDriver`) rather
than reinventing navigation, and adds only the domain method `getCurrentSection()`
on top. Its whole job is composition + a little semantics.

### When a single feature legitimately grows large

`AdminSettingsDriver` is a rule-4 feature driver for the settings form, and it
declares **13 direct parts** — over the ~7–10 ceiling the algorithm warns about:

```ts
const parts = {
  tabs: { locator: byDataTestId(T.tabs), driver: TabListDriver },
  orgInput: { locator: byDataTestId(T.orgInput), driver: TextInputDriver },
  plan: { /* … */ driver: SegmentedControlDriver },
  channels: { locator: byDataTestId(T.channels), driver: CheckboxListDriver },
  // … density, beta, model, renewal, unsavedBanner, save,
  //     deleteTrigger, deleteDialog, toast
} satisfies ScenePart;
```

This is fine, and it is the important nuance: the ceiling is a **prompt to
review, not a hard rule**. All 13 parts belong to a single domain concern (one
settings form), and the driver exposes one coherent vocabulary — `setValue()`,
`getValue()`, `save()`, `deleteWorkspace()`. The decomposition failure the
algorithm guards against is a driver mixing parts from **unrelated** domains
(header controls _and_ form fields _and_ a data grid), regardless of count. A
single-domain form that happens to have many controls is not that.

## Case study: one root entry per page (MUI ticket console)

[`example-mui-ticket-console`](https://github.com/atomic-testing/atomic-testing/tree/main/examples/example-mui-ticket-console/src/testing)
makes rule 6 unmissable — the entire console is reached through one entry:

```ts
export const consoleParts = {
  console: { locator: byDataTestId(AppDataTestId.console), driver: TicketConsoleDriver },
} satisfies ScenePart;
```

`TicketConsoleDriver` then composes the filter bar, the grid (a rule-2 list of
rows), and the editor — but a reader of the scene sees one door into the page,
not seven. The DOM tests and the Playwright specs import this same `consoleParts`
and the same drivers; only the engine construction differs per runner.

## Case study: reuse + feature drivers (shadcn)

[`example-shadcn-workspace`](https://github.com/atomic-testing/atomic-testing/tree/main/examples/example-shadcn-workspace/src/testing)
mixes both leverage points in one page object — reuse (rule 1) and extraction
(rule 4):

```ts
const parts = {
  account: { locator: byDataTestId(WorkspaceHeaderDataTestId.root), driver: AccountMenuDriver },
  tabs: { locator: byDataTestId(AppDataTestId.settingsTabs), driver: TabsDriver },
  profile: { locator: byDataTestId(ProfileSettingsDataTestId.form), driver: ProfileFormDriver },
  danger: { locator: byDataTestId(ProfileSettingsDataTestId.dangerZone), driver: DangerZoneDriver },
} satisfies ScenePart;
```

`tabs` reuses the shipped shadcn `TabsDriver` verbatim (rule 1); `account`,
`profile`, and `danger` are extracted feature drivers (rule 4) because each is a
nameable feature with its own operations (`account.choose('Sign out')`,
`profile.save()`). The page object stays thin.

## The anti-pattern: feature drivers without a page object

[`example-mui-signup-form`](https://github.com/atomic-testing/atomic-testing/tree/main/examples/example-mui-signup-form)
is the repo's named counter-example. It has the rule-4 half right — each wizard
step is its own feature driver colocated with its component
(`CredentialFormDriver`, `ShippingAddressFormDriver`, `BillingAddressFormDriver`,
`InterestFormDriver`, `SignupReviewDriver`). What it is **missing** is rule 6:
there is no single page-object driver that composes the steps into a wizard.
Each step driver is only ever exercised in isolation by a per-step unit test,
each spinning up its own one-part scene.

The cost shows up the moment you want to test the flow _across_ steps — "fill
credentials, advance, fill shipping, review, submit". With no wizard page object
there is nowhere for that flow to live, so it leaks into a test as raw step-by-step
choreography, or it simply never gets written. The fix is exactly rule 6: a
`SignupWizardDriver` whose `ScenePart` composes the step drivers, exposing a
flow-level API. (The golden-fixture harness under
[`scripts/skills/`](https://github.com/atomic-testing/atomic-testing/tree/main/scripts/skills)
asserts this gap still exists — a tripwire that flips to a failing regression
test the day the wizard page object is added.)

## The fixed idioms of a composite driver

Every composite driver in the examples above shares three idioms worth
internalizing:

- **The contravariant constructor.** The option parameter is the empty-default
  `Partial<IComponentDriverOption>` — _not_ parameterized with `typeof parts` —
  and `parts` is hardcoded in the body. Constructor parameters are checked
  contravariantly, so the "natural" parameterized signature makes the class
  unplaceable in a parent scene. See
  [Build Component Driver](../advanced-concepts/build-component-driver.mdx) for
  the base-class mechanics.
- **`satisfies ScenePart`** on the parts object, so a mistyped locator or driver
  is a compile error, not a silent locator break.
- **The `AssertScenePlaceableDriver` lock** (recommended) — a one-line
  compile-time assertion that catches a constructor regression at the driver's
  definition rather than at a distant call site.

## Enforcement

The decision procedure lives in the
[`scaffold-test-driver`](https://github.com/atomic-testing/atomic-testing/tree/main/.claude/skills/scaffold-test-driver)
skill, and a structural checker under
[`scripts/skills/`](https://github.com/atomic-testing/atomic-testing/tree/main/scripts/skills)
regression-tests the examples above against these invariants — flagging a god
driver (too many parts), a page scene with more than one root entry, and the
missing-page-object anti-pattern. Reach for the skill when you start a driver
tree; this guide is the "why" behind what it does.
