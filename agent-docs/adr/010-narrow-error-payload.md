# ADR-010: Narrow the error payload to a serializable shape

## Status

Accepted (2026-06-29). Part of the 1.0 freeze. Decision **D4** of the core gap audit (issue #965).

## Context

Every error extended `ErrorBase`, which exposed
`public readonly driver: ComponentDriver<any>` — so a thrown error carried a
**live driver** (and through it the `Interactor`, and through that the DOM) as
part of the frozen, catchable contract. `InteractorErrorBase` likewise exposed
`locator: PartLocator`, and `ItemNotFoundError` / `TooManyMatchingElementError`
carried both. Freezing this at 1.0 would:

- pin the error API to the still-evolving driver and locator types;
- invite consumers to reach driver/DOM internals through a caught error; and
- leak `any` into the public error surface via `ComponentDriver<any>`.

## Decision

**Narrow the error fields to a minimal, serializable payload** and remove the live
references:

- `ErrorBase` carries `driverName: string` (not the driver).
- `InteractorErrorBase` carries `locatorDescription: string` (not the locator),
  computed via `getLocatorInfoForErrorLog`.
- `ItemNotFoundError` / `TooManyMatchingElementError` carry `locatorDescription`
  (the live `locator` / `query` fields are gone); `MissingPartError` keeps its
  serializable `missingPartName` and no longer carries the driver.

To keep this a low-ripple change, the base constructors accept a **structural**
`{ driverName: string }` rather than `ComponentDriver`: a `ComponentDriver`
satisfies it, so the ~30 throw sites still pass `this` / the driver unchanged, but
only the **name** is retained. No live driver or locator survives on a caught
error, and neither `ComponentDriver`, `PartLocator`, nor `any` appears in any error
**field**.

## Consequences

- ✅ The catchable contract is fully serializable and decoupled from the
  `ComponentDriver` / `PartLocator` types; the `any` leak is gone.
- ✅ Aligns with the unified element-not-found error contract
  ([ADR-006](006-1.0-api-freeze-and-evolution.md) §5).
- ⚠️ Breaking for anyone who read `error.driver` / `error.locator` / `error.query`
  — no in-repo, test, or example reader exists; done now, before 1.0.
- ℹ️ The interactor-level subclasses (`ElementNotFoundError`, `WaitForFailureError`,
  `ItemNotFoundError`, `TooManyMatchingElementError`) still accept a live
  `PartLocator` **at construction** to derive the message and description — a clean,
  `any`-free type, used and discarded, never stored.
- ℹ️ The out-of-freeze `MenuItemNotFoundError` (`component-driver-mui-*`) extends
  `ErrorBase` and compiles unchanged (`ComponentDriver` satisfies the structural
  param). Narrowing its own `driver` field belongs to the MUI packages' own review.

## Alternatives considered

| Alternative                                                              | Why not chosen                                                                                                                        |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Keep the live `driver` field, document only `.name`/`.message` as stable | Leaves a live driver (→ DOM) reachable from every caught error and `any` in the public type; a doc note cannot un-freeze that.        |
| Take `driverName: string` directly in `ErrorBase`                        | Forces every throw site and each out-of-freeze subclass to pass `.driverName`; the structural param achieves the same with no ripple. |

## Related

- [ADR-006](006-1.0-api-freeze-and-evolution.md) §5 — the unified error contract this aligns with.
- Issue #965.
