# ADR-012: Remove dead `clone()` / `wait()` from the `Interactor` contract

## Status

Accepted (2026-06-29). Part of the 1.0 freeze. Decision **D6** of the core gap audit (issue #967).

## Context

The `Interactor` interface is frozen at 1.0 ([ADR-006](006-1.0-api-freeze-and-evolution.md)),
so every member becomes a contract each implementer — including third parties —
must support forever. Two members were dead surface:

- **`clone(): Interactor`** — zero runtime callers anywhere in the repo, no JSDoc,
  and undefined semantics. The implementations disagreed on what "clone" even
  means: `PlaywrightInteractor.clone()` returns a new wrapper over the **same**
  `page`, so it is not a clone in any meaningful sense.
- **`wait(ms): Promise<void>`** — zero real callers; a fixed-sleep primitive that
  contradicts the library's own `waitUntil` / `waitUntilComponentState` model
  (poll-until-condition, never sleep-a-guess).

Freezing either would force every adapter to implement a purposeless method and
would bless a fixed-sleep anti-pattern in the stable contract.

## Decision

Remove `clone()` and `wait(ms)` from the `Interactor` interface and from all
**five** interactor implementations — `DOMInteractor`, `ReactInteractor`,
`VueInteractor`, `LegacyReactInteractor`, and `PlaywrightInteractor` — before 1.0.
(The original audit named four implementations; `LegacyReactInteractor` was added
afterward and is included here.)

- The frozen timing surface is exactly `{ waitUntil, waitUntilComponentState }`.
- `timingUtil.wait(ms)` **remains** for the rare, deliberate sleep — it is a
  utility, not part of the `Interactor` contract.
- Removal was confirmed safe: no in-repo, test, or example caller invokes either
  member (the only `super.wait()` calls were inside the overrides being removed).

If a genuine need for either reappears post-1.0, it returns as an **optional**
`Interactor` member per [ADR-007](007-interactor-evolution-and-composition.md) §1,
which is additive and non-breaking.

## Consequences

- ✅ The frozen `Interactor` is two members smaller; adapter authors implement
  two fewer no-op methods.
- ✅ No fixed-sleep primitive in the stable contract.
- ✅ The `etc/*.api.md` reports for the affected packages record the removal as a
  reviewed surface change.
- ⚠️ Removing interface members is breaking for any out-of-tree implementer that
  somehow depended on them; done now, before 1.0, precisely so it never has to be
  a post-1.0 major.

## Related

- [ADR-006](006-1.0-api-freeze-and-evolution.md) — the freeze that makes dead surface a permanent cost.
- [ADR-007](007-interactor-evolution-and-composition.md) §1 — the optional-member path for re-introducing either member if ever needed.
- Issue #967.
