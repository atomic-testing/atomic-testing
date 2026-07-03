# @atomic-testing/angular-core

Shared implementation core for the Angular adapters of
[Atomic Testing](https://atomic-testing.dev). It provides:

- `AngularInteractor` — extends `DOMInteractor` and settles Angular change
  detection after every interaction via `ApplicationRef.whenStable()`, which
  is correct under both zone.js and zoneless change detection.
- `createTestEngine` — bootstraps a standalone component through Angular's
  real bootstrap API (`createApplication` + `ApplicationRef.bootstrap`, not
  `TestBed`) and returns a `TestEngine`. When zone.js is not loaded,
  `provideZonelessChangeDetection()` is added automatically.
- `createRenderedTestEngine` — wraps an element rendered by an Angular app
  bootstrapped elsewhere.

## Do not depend on this package directly

Install the package matching your Angular major instead — each pins the
correct `@angular/*` peer range and re-exports this package's entire surface:

| Angular major | Package                      |
| ------------- | ---------------------------- |
| 20            | `@atomic-testing/angular-20` |
| 21            | `@atomic-testing/angular-21` |
| 22            | `@atomic-testing/angular-22` |

This mirrors the `react-core` / `react-18` / `react-19` layering; see
ADR-013 (`agent-docs/adr/013-angular-shared-core-thin-packages.md`) for the
rationale.

## Usage

See the per-major package READMEs, or the validation fixture in
`package-tests/angular-20-test` for a runnable example covering both zone.js
and zoneless configurations.
