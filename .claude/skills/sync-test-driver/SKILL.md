---
name: sync-test-driver
description: >
  Use when the UI changed and an existing atomic-testing driver/scene must
  catch up — e.g. "I changed this component, update its driver", "add a method
  for the new X", "the data-testid got renamed", "this section became a list",
  "the driver is out of date". Encodes incremental maintenance: re-probe the
  current DOM and diff it against every locator the driver assumes, re-walk the
  locator ladder for anything broken (never a one-off patch), apply the six-rule
  decomposition to new UI surface to decide part-vs-promotion, and update in
  place without regenerating the tree or breaking hand-written methods.
---

# Syncing a driver tree after the UI changed

The driver was correct when written; the component moved. The job is a **diff,
not a rewrite**: find exactly what's stale, fix each stale item by the same
rules that authored it, and leave everything still-correct — including
hand-written methods and their public names — untouched. Never regenerate a
tree that tests already import.

## Phase 0 — Map the blast radius

1. **Read the component change itself** — `git diff` (or `sl diff`) of the
   component file(s), or the described change if it isn't committed yet. You
   are looking for: renamed/removed test-ids and attributes, added/removed
   elements, structural moves (a wrapper inserted, content portalled out), and
   cardinality changes (one fixed block → a repeated collection).
2. **Find every driver and scene touching that component**: the colocated /
   `src/testing/` driver file, grep for the component's test-id constants
   (`<Feature>DataTestId`), and any parent ScenePart that places the driver.
   If test-ids are shared through a constants module imported by both component
   and driver, a rename already surfaced as a compile error — start there.
3. **Find the consumers**: grep the test files for the driver's public methods
   and parts. This list decides what must keep working unchanged, and what to
   re-run in Phase 4.

## Phase 1 — Re-probe and diff (evidence, not memory)

Re-run the throwaway-probe technique against the **current** DOM (see
`scaffold-test-driver` Phase 3): render the component in the project's DOM
runner, log `outerHTML` at the driver root, and for **each part locator the
driver declares**, probe whether it still resolves — and whether it still
resolves to the element the method semantics assume (a selector that now
matches a *different* element is worse than one that matches nothing):

```tsx
// _probe.test.tsx — THROWAWAY, delete before committing
const el = document.querySelector('[data-testid="settings-panel"]');
console.log('OUTER=', el?.outerHTML);
for (const [name, sel] of Object.entries(currentPartSelectors)) {
  console.log(name, '→', document.querySelector(sel)?.outerHTML?.slice(0, 120) ?? 'NO MATCH');
}
```

The output sorts every part into: **still correct** (leave alone), **broken**,
**repointed** (resolves, wrong element), plus **new surface** the driver has no
part for, and **removed surface** the driver still declares.

## Phase 2 — Classify and fix each stale item

**Broken or repointed locator** → re-walk the escalation ladder from the top
(`scaffold-test-driver` Phase 4); do **not** patch the old selector with one
more `:nth-child` or class hop — a locator that broke once from markup drift
will break again unless it moves up a rung toward test-id/role/a11y-link. Since
this is the app's own code, the strongest fix is often adding/renaming a
`data-testid` in the component source via the shared constants module. Then
re-verify the **two-instance disambiguation** for every locator you touched.

**New UI surface** → run the six-rule decomposition on it
(`scaffold-test-driver` Phase 1), exactly as if scaffolding fresh:

- Covered by a shipped driver → add a part reusing it.
- A repeated collection → a `ListComponentDriver` part (if the section *became*
  a list — e.g. one fixed row is now N rows — replace the fixed parts with the
  list part; don't keep both).
- Caller-varying content → a `ContainerDriver` with `content` threaded at the
  call site.
- A nameable, semantically independent feature → **promote it to its own child
  driver file**, not method #11 on the parent. Concrete promotion triggers: the
  parent would cross **~7–10 direct parts**; the new surface has its own
  component file or domain operation; or it could plausibly render twice.
- Otherwise → inline nested part entries.

**Removed UI surface** → delete the part **and** the methods that read it, but
first grep tests for those methods (Phase 0 list): update the consumers in the
same change, or — if a consumer legitimately still needs the behavior — stop
and surface the conflict to the user instead of leaving a method that returns
`undefined` forever (that's a vacuously-green test factory; see
`diagnose-test-failure` Mode 3).

**Semantics changed but the operation survives** (e.g. "save" is now a
two-step confirm) → keep the public method name and update its body; the whole
point of the driver layer is that tests survive this. Add new waits inside the
method if the new UI settles asynchronously (animate-out, portal unmount) so
every caller inherits the fix.

## Phase 3 — Incremental-update rules

- **Never regenerate the whole driver/scene file** from scratch — hand-written
  methods, JSDoc, and waits would silently vanish. Edit in place.
- **Keep public method names and part names stable** when the user-visible
  behavior is unchanged; rename internals freely.
- A rebased/merged driver can be stale-patterned even when the merge was clean —
  reconcile any override or copied idiom against its current siblings before
  trusting it.
- Keep the shared test-id constants module the single source of truth: a
  test-id rename lands as one constant edit (component + driver both import it),
  never as a two-file string hunt.
- Delete the probe file.

## Phase 4 — Verify

1. Type-check with the project's command — the `AssertScenePlaceableDriver`
   locks and constants-module renames surface here first.
2. Re-run **every test file that consumes the touched drivers** (the Phase 0
   consumer list) — not just the one that prompted the sync — in the DOM runner
   **and** every Playwright project the config declares.
3. Confirm the two-instance and absent-case coverage still passes for every
   locator you changed; add those cases if the original driver lacked them —
   they're what catch the *next* drift early.

If new tests are wanted for the new surface, hand off to
`author-component-tests`; if a still-red test resists classification, that's
`diagnose-test-failure`.
