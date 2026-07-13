---
name: author-component-tests
description: >
  Use when writing behavior tests against an existing atomic-testing driver
  tree — e.g. "write a test that does X", "cover the case where Y", "add a test
  for the empty state", "test that saving shows a toast". Assumes the scene and
  drivers already exist (hand-written or from scaffold-test-driver). Encodes
  translating a plain-language behavior into driver calls plus assertions, the
  anti-flake toolkit applied by default (waitUntil probes instead of sleeps,
  tolerance-based geometry, environment gating for what jsdom can't evaluate),
  and the hard handoff rule when the driver tree is missing a method or part.
---

# Authoring behavior tests against a driver tree

A test never touches the DOM or the Playwright `page` directly — it reads and
acts **only through driver methods**, so the same test logic runs unchanged in
every environment. Your job is to translate "the user filters, edits, saves,
and sees a toast" into driver calls and assertions that cannot flake.

## Phase 0 — Inventory the semantic surface

1. **Read the scene module and the drivers it wires** (e.g.
   `src/testing/<page>Parts.ts` and each `*Driver.ts` it imports, plus the
   shipped drivers' typings). List the methods you have to work with — many
   "missing" operations are inherited from `ComponentDriver` (`getText`,
   `exists`, `isVisible`, `click`, `waitUntilComponentState`, …). Don't rebuild
   what's inherited.
2. **Detect the project's sharing pattern.** The strongest convention: scenario
   functions written once against the driver tree, with a tiny `Assert`
   interface each runner adapts its own `expect` into —

   ```ts
   export interface Assert {
     equal<T>(actual: T, expected: T, message?: string): void;
     isTrue(value: boolean, message?: string): void;
   }
   export async function triageFlow(console: TicketConsoleDriver, assert: Assert) { … }
   ```

   — imported verbatim by both the DOM test (engine from
   `createTestEngine(<App />, parts)`) and the E2E spec (engine from
   `createTestEngine(page, parts)`). If the project shares scenarios, add yours
   there; don't fork a second copy per runner.
3. Every DOM test's `afterEach` must call (and await) `engine.cleanUp()` —
   a skipped cleanup is how the *next* test gets contaminated.

## Phase 1 — Translate behavior into driver calls

- Arrange / act / assert **at the domain level**: `console.filterBar.filterByStatus('Open')`,
  not a chain of clicks a reader has to decode. If the flow reads like DOM
  choreography, the semantics belong in a driver method — see the handoff rule.
- Assert **concrete expected values**, not that two reads agree.
  `assert.equal(await grid.getAssignee(0), 'Me')` proves something;
  `assert.equal(await a.getText(), await b.getText())` passes when both are
  `undefined` because a locator matched nothing. Guard "component absent"
  expectations explicitly with `exists()`.
- Cover, as first-class cases: the happy path, the **empty/absent case** (the
  driver returns `undefined` / count `0` — not a throw), and for any new-ish
  locator, the **two-instance disambiguation** case.

## Phase 2 — The anti-flake toolkit (default, not opt-in)

**Never a hand-rolled sleep.** No `setTimeout`, no `page.waitForTimeout`, no
`wait(500)`. Anything that settles asynchronously gets a probe:

- **Presence/visibility transitions** → `waitUntilComponentState`:

  ```ts
  await editor.waitUntilComponentState({ condition: 'visible', timeoutMs: 5000 });
  // conditions: 'attached' | 'visible' | 'detached' | 'hidden'
  ```

- **Any other settling value** → `waitUntil` (available on every driver):

  ```ts
  // Real-world shape: a closing menu stays mounted for its ~100ms animate-out,
  // and mounted content IS the "open" signal — so wait for the unmount instead
  // of sampling isOpen mid-animation. (jsdom runs no animations; there the
  // probe terminates on its first pass.)
  await menu.waitUntil({
    probeFn: () => menu.isOpen(),
    terminateCondition: false,
    timeoutMs: 1000,
  });
  ```

  `terminateCondition` takes a value or a predicate; `probeIntervals: [50, 100, 250]`
  probes densely first then backs off — right for "usually instant, occasionally
  slow" settles.
- **Prefer the wait inside the driver method** when the settling is intrinsic to
  the action (every caller of `choose()` needs the unmount wait), and in the
  test when it's scenario-specific. A wait copy-pasted into three tests is a
  driver method waiting to happen.
- **Geometry / coordinates** → approximate equality with a **stated tolerance**,
  never exact: browsers disagree by sub-pixel offsets (~0.6px across the three
  Playwright engines). `expect(x).toBeCloseTo(expected, 0)` or
  `assert.isTrue(Math.abs(actual - expected) <= 1, 'within 1px')`.
- **Environment gating** — jsdom has no layout engine: bounding rects are all
  zeros, `scrollIntoView`/`scrollBy` are no-ops, animations don't run, and
  `isVisible` is CSS-property-based (`display`/`visibility`/`opacity`), not
  viewport position. Route layout-, scroll-, and animation-dependent assertions
  to the E2E spec only — or thread a capability flag through shared scenarios:

  ```ts
  export async function scrollFlow(page: PageDriver, assert: Assert, env: { hasLayout: boolean }) {
    await page.list.scrollToBottom();
    if (env.hasLayout) {
      assert.isTrue(await page.loadMore.isVisible(), 'sentinel scrolled into view');
    }
  }
  // DOM test passes { hasLayout: false }; E2E passes { hasLayout: true }.
  ```

  An ungated layout assertion in jsdom doesn't fail — it **vacuously passes**
  (zero rects compare fine), which is worse.

## Phase 3 — The handoff rule (hard boundary)

If an assertion or action you need reveals the driver tree is missing a method
or a part — **stop; do not hack around it inline**. No `document.querySelector`
in a test, no `page.locator()` beside the engine, no reading state through an
unrelated part's locator. That workaround is invisible to every other test and
breaks silently when the DOM shifts.

Instead, switch to `scaffold-test-driver` (its Phases 3–6: probe, locator
ladder, implement, verify) to add the method or part properly — then resume
authoring here. If the gap implies the UI itself changed since the driver was
written, that's `sync-test-driver`.

## Phase 4 — Verify

1. Run the new tests with the project's DOM command (`npx vitest run <file>` /
   `npx jest <file>`).
2. Run **every Playwright project** the config declares (`npx playwright test`),
   not just chromium.
3. For anything wait-based you touched, prove stability rather than assuming
   it: `npx playwright test <file> --repeat-each=10` (and re-run the DOM file a
   few times). One green run of a formerly-flaky path is not evidence.

If a test is red or intermittently red and the cause isn't obvious, switch to
`diagnose-test-failure` rather than tweaking timeouts.
