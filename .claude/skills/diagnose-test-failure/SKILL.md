---
name: diagnose-test-failure
description: >
  Use when an atomic-testing test is red, intermittently red, or suspiciously
  green — e.g. "this test is flaky", "why is this failing", "it passes locally
  but not in CI", "it fails when I run the whole suite", "this test passes but
  the feature is broken". A decision tree that classifies the failure into one
  of four modes — flaky, brittle, vacuously green, contaminated — each with a
  matchable symptom, a confirming check, and the library's intended fix. The
  one banned move: adding a sleep or lengthening a timeout without a diagnosis.
---

# Diagnosing a failing, flaky, or suspiciously green test

Four failure modes cover essentially every driver-based test problem. Classify
first, then apply that mode's fix. **The banned move:** a longer timeout or an
added sleep without a diagnosis — it converts a diagnosable failure into a
slower, rarer one.

## Phase 0 — Characterize before touching anything

Run these and record the outcomes; the pattern IS the classification:

1. **The single test, repeated** — `npx vitest run <file> -t '<name>'` a few
   times; for E2E, `npx playwright test <file> --repeat-each=10`.
2. **The whole file / suite** — does the test behave differently alone vs. with
   its siblings? (`vitest run <file>` vs. the single `-t` run.)
3. **Per environment** — DOM runner vs. each Playwright project. A
   chromium-only or jsdom-only failure localizes the cause.
4. **Read the actual error**: an assertion mismatch, a locator that resolved to
   nothing, a timeout inside `waitUntil` (it returns the last probed value; the
   *assertion after it* is what fails), or a thrown DOM API error.

| Pattern | Mode |
|---|---|
| Same commit: sometimes green, sometimes red | **1 · Flaky** |
| Deterministically red since an upgrade/refactor that didn't change behavior | **2 · Brittle** |
| Green, but the feature is broken / the assertion can't actually run here | **3 · Vacuously green** |
| Result depends on which tests ran before it | **4 · Contaminated** |

## Mode 1 — Flaky (a race, not randomness)

**Symptom:** intermittent on the same code; error is usually "expected X,
received <stale value>" or a `waitUntil` timeout; more frequent in CI or under
`--repeat-each`; often E2E-only because real browsers have real latency and
animations (jsdom runs none — so "flaky only in Playwright" still usually means
a race, not a browser bug).

**Confirm:** find the assert-that-races — an assertion immediately after an
action whose effect settles asynchronously (re-render, animation, network,
portal mount/unmount).

**Fix:** convert assert-immediately into a probe, at the right layer:

- Presence/visibility transition →
  `await driver.waitUntilComponentState({ condition: 'visible' | 'attached' | 'detached' | 'hidden', timeoutMs })`.
- Any other settling value →

  ```ts
  await driver.waitUntil({
    probeFn: () => driver.isOpen(),
    terminateCondition: false, // value or predicate
    timeoutMs: 1000,
  });
  ```

- If **every** caller of an action needs the wait (e.g. a close that animates
  out), move the probe **inside the driver method** so no test can forget it.
- Never fix by raising `timeoutMs` on an assertion that doesn't probe — a
  bigger window around an unsynchronized read is still a race.

## Mode 2 — Brittle (coupled to incidental markup)

**Symptom:** deterministically red after a design-system/library upgrade, a
styling refactor, or an unrelated DOM reshuffle; the error is "element not
found" / locator resolves to nothing, or a method reads the wrong element's
text. The behavior under test never changed.

**Confirm:** re-probe the real DOM (throwaway probe test — see
`scaffold-test-driver` Phase 3), and compare against what the locator assumes.
Typical culprits: class-name coupling (`.MuiButton-root`, hashed CSS-module
classes), positional coupling (`:nth-child`, "second `<div>`"), or a wrapper
element inserted between parent and child.

**Fix:** walk the locator **up the escalation ladder** toward semantics (the
full ladder is in `scaffold-test-driver` Phase 4): test-id from the shared
constants module, `byRole`/`byAriaLabel`/`byAttribute`, an explicit a11y link
via `byLinkedElement`, before any structural CSS. In your own app, adding a
`data-testid` to the component source beats any clever selector. Then re-verify
the **two-instance disambiguation** — a broadened selector that now matches two
elements is the next bug. If the UI genuinely changed shape (new/removed
surface, not just markup drift), switch to `sync-test-driver`.

## Mode 3 — Vacuously green (passes while proving nothing)

**Symptom:** the test is green but the feature is broken; or a review shows an
assertion the environment cannot evaluate. The two big sub-cases:

- **jsdom asserting layout**: no layout engine means bounding rects are all
  zeros, `scrollIntoView`/`scrollBy` no-op, animations never run, and
  `isVisible` only checks CSS properties (`display`/`visibility`/`opacity`) —
  so geometry comparisons of `0 === 0` "pass".
- **Absent-element equality**: `expect(await a.getText()).toEqual(await b.getText())`
  where both locators match nothing — `undefined === undefined`, green forever.

**Confirm:** log the raw probed values once (`console.log(await driver.getBoundingRect())`),
or make the assertion strict (`toBe('Saved')` instead of comparing two reads)
and watch it fail.

**Fix:**

- Gate layout/scroll/animation assertions to the environment that can evaluate
  them — E2E-only spec, or a `hasLayout`-style capability flag threaded through
  shared scenarios (see `author-component-tests` Phase 2).
- Precede "reads agree" assertions with an existence guard:
  `expect(await driver.exists()).toBe(true)` — and assert **concrete expected
  values**, not agreement between two reads.
- For intentional absent-case tests, assert the *specific* absent signal
  (`toBeUndefined()`, count `0`) so the case is explicit, not accidental.

## Mode 4 — Contaminated (order-dependent)

**Symptom:** passes alone, fails in the full run — or the reverse (it only
passes because a predecessor left state behind). Reordering or `--shuffle`
changes the outcome.

**Confirm:** run the file with only this test (`-t`), then the full file; if
results differ, bisect by disabling siblings until the polluting pair emerges.

**Fix — in likelihood order:**

1. **Missing/unawaited cleanup**: every DOM test's `afterEach` must call *and
   await* `engine.cleanUp()`. A skipped or un-awaited cleanup leaves the
   previous render mounted under the next test.
2. **Portal leftovers**: `'Root'`-rooted locators (toasts, menus, dialogs
   rendered on `<body>`) match content from a previous test that never
   unmounted. Wait for `{ condition: 'detached' }` before finishing the flow
   that opened them; re-check the leaking part's locator is scoped tightly
   enough.
3. **Shared module/app state**: seeded stores, module-level singletons, fake
   timers or mocked network left installed. Reset per test in the app's own
   setup, not inside drivers.

## Close-out

Re-run the Phase 0 matrix after the fix: single test repeated (10+ for a former
flake), full file, every configured environment. A former Mode-4 fix must also
be re-run in the *original failing order*. If the diagnosis revealed a missing
driver capability, route it through `scaffold-test-driver`; if it revealed the
UI drifted from the driver, route it through `sync-test-driver`.
