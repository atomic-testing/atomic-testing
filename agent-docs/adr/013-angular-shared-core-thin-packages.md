# ADR-013: Angular support via a shared core and thin per-major packages

## Status

Accepted (2026-07-03). Implements #1013.

> **Update (2026-07-04):** The zone.js-loaded-at-bootstrap detection described
> in point 3 below was incomplete. `createApplication()`'s own default change-
> detection strategy changed between majors: Angular 20's `internalCreateApplication`
> defaults to zone-based CD, but Angular 21+ defaults to
> `provideZonelessChangeDetectionInternal()` regardless of whether zone.js is
> loaded — so merely loading zone.js was not enough on 21/22 to actually get
> zone-based change detection, and a `setTimeout`-driven update was silently
> not settled by `whenStable()` under "zone" mode on those majors (Angular 20
> only worked because its default happened to match). Only surfaced once
> `angular-21-test`/`angular-22-test` were added and made to actually
> bootstrap against their own installed major (a separate, now-fixed module-
> resolution bug had them all silently running Angular 20's runtime
> regardless). Fixed in `createTestEngine.ts`: the zone.js-presence check now
> always explicitly provides `provideZoneChangeDetection()` or
> `provideZonelessChangeDetection()` — never omits both and relies on
> `createApplication()`'s own default — making the choice version-independent.

## Context

Angular support (Angular 20–22) was added to the component-driver pattern.
[ADR-003](003-version-specific-packages.md) established one package per
framework major so each pins an exact peer range, and named its trade-off:
duplication (`react-18`/`react-19` are implementation-identical maintained
copies). [ADR-005](005-drop-mui-5-support.md) showed the flip side — per-major
packages give a clean freeze/EOL story when a major ages out.

Angular's specifics shaped three further decisions:

- **Bootstrap API is stable across 20–22.** `createApplication` +
  `ApplicationRef.bootstrap` (both from Angular's real bootstrap path, not
  `TestBed`) are identical across the supported majors, so unlike React
  (whose render API changed at 18) there is nothing version-specific to
  implement per major — only peer ranges differ.
- **Settling cannot assume zone.js.** Zoneless change detection is a per-app
  runtime configuration (stable opt-in since 20.2, default for new apps at
  21+), so the same installed major may run either mode.
- **Stability is per-instance, not global.** React's `act()` is a bare
  function; Angular stability lives on the `ApplicationRef` returned by the
  bootstrap of _that_ app. An Angular interactor therefore cannot be a
  zero-arg `new AngularInteractor()` — it needs the app's stability handle
  injected at construction.

## Decision

1. **One shared implementation package, `angular-core`** — holds
   `AngularInteractor extends DOMInteractor` _and_ the Angular
   `createTestEngine`/`createRenderedTestEngine` (unlike React, where
   `createTestEngine` lives in the per-major packages, because Angular's
   bootstrap API does not vary across supported majors).
2. **Thin per-major packages `angular-20` / `angular-21` / `angular-22`** —
   each is a single `export * from '@atomic-testing/angular-core'` plus a
   `package.json` pinning the matching `@angular/*` peer range
   (`>=20 <21`, `>=21 <22`, `>=22 <23`). `zone.js` and `@angular/compiler`
   are optional peers (zoneless apps have no zone.js; AOT apps need no JIT
   compiler).
3. **Settling via `ApplicationRef.whenStable()`**, injected into
   `AngularInteractor` at construction (as a minimal structural
   `AngularAppStability` interface, so the interactor itself does not import
   `@angular/core`). `whenStable()` resolves when change detection is idle
   under **both** zone.js and zoneless modes, so no zone feature detection is
   needed at interaction time; each settle is bounded by a timeout because
   `whenStable()` never resolves for apps that never stabilize (e.g.
   `setInterval` inside the zone). Zone.js feature detection happens once at
   bootstrap instead: `createTestEngine` always explicitly provides
   `provideZoneChangeDetection()` when `Zone` is present or
   `provideZonelessChangeDetection()` when it is absent — never omits both,
   since `createApplication()`'s own default CD strategy is not consistent
   across majors (see the 2026-07-04 update above). Updates Angular cannot
   track (bare timers under zoneless) remain covered by the existing polling
   `waitUntil` path in `DOMInteractor`.
4. **Async `createTestEngine`.** Angular bootstrap is inherently async, so the
   Angular `createTestEngine` returns `Promise<TestEngine<T>>` — a deliberate
   signature divergence from the sync React/Vue variants.
5. **Validation runs in a real browser via Vitest browser mode**
   (`package-tests/angular-20-test`), with two projects — zone.js loaded and
   absent — running the same test file. A Playwright e2e page (the
   `component-driver-html-test` pattern) was rejected because it exercises
   `PlaywrightInteractor`, never `AngularInteractor`; Jest+jsdom was rejected
   because zone.js-in-jsdom needs `jest-preset-angular`-style workarounds and
   jsdom is not a real browser.

This **refines ADR-003 rather than contradicting it**: consumers still get
exact per-major peer isolation and each major can be frozen independently
(à la ADR-005), but the ~95%-duplication consequence ADR-003 accepted is
eliminated for Angular — a cross-cutting fix lands once in `angular-core`.

## Consequences

- ✅ Exact peer ranges per major; per-major freeze/EOL unchanged.
- ✅ Zero implementation duplication across `angular-20/21/22`.
- ✅ Correct settling under both change-detection modes, verified in a real
  browser under both configurations.
- ⚠️ A genuinely version-specific Angular behavior change would require
  promoting code out of `angular-core` into the affected thin package —
  acceptable; the React layout shows the shape that takes.
- ⚠️ `angular-core`'s own peer range must span all supported majors
  (`>=20 <23`) and be widened on each new major.
- ⚠️ The Angular `createTestEngine` is `async`, so it did not fit the
  then-synchronous `GetTestEngine` contract of `internal-test-runner` — the
  fixture uses plain Vitest instead of the shared three-file pattern.
  _Amended 2026-07-04 (#1025):_ `GetTestEngine` now also accepts
  `Promise<TestEngine>` (awaited by `useTestEngine`), so the Angular Material
  driver suites (`package-tests/component-driver-angular-material-*-test`)
  do run the shared three-file pattern; the adapter fixtures
  (`package-tests/angular-*-test`) deliberately stay on plain Vitest to
  exercise `AngularInteractor` settling directly.
- ⚠️ A settle that hits the timeout proceeds silently (by design, to avoid
  deadlock); tests on never-stabilizing apps must rely on polling.

## Alternatives considered

| Alternative                                                       | Why not chosen                                                                                                    |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Copy the implementation into each per-major package (React model) | Angular's bootstrap API is identical across 20–22; copies would be pure duplication, the cost ADR-003/005 flagged |
| Single `angular` package with a wide peer range                   | Loses exact-major peer signaling and the per-major freeze story of ADR-003/005                                    |
| Zone.js feature detection per interaction (issue's sketch)        | `ApplicationRef.whenStable()` already abstracts zone vs. zoneless; detection is only needed once, at bootstrap    |
| `TestBed`-based mounting                                          | Couples the adapter to Angular's testing harness; the repo's pattern is real render APIs (`createRoot`, `mount`)  |
| `NgZone.onStable` as the settle signal                            | Zone-only; requires a second code path for zoneless and an injector lookup — `whenStable()` covers both           |

## Related

- [ADR-003](003-version-specific-packages.md), [ADR-005](005-drop-mui-5-support.md).
- [modules/framework-adapters.md](../modules/framework-adapters.md).
