# ADR-015: Narrow ComponentDriver's low-level primitives to `protected`

## Status

Accepted (2026-07-08). Part of the 1.0 freeze. Issue #1045.

## Context

`ComponentDriver` (`packages/core/src/drivers/ComponentDriver.ts`) exposed a
large, uniform, low-level surface — every raw pointer and keyboard gesture
(`mouseDown/Up/Move/Over/Out/Enter/Leave`, `dragTo`, `drag`, `contextMenu`,
`activate`, `scrollBy`), plus `getBoundingRect` and `innerHTML` — publicly. That
surface is inherited by **every** concrete driver and by the engine root
(`TestEngine`), where most of it is meaningless and, for the DOM/Playwright
adapters, actively crashed on the `[]` root locator (see
[#1048](https://github.com/atomic-testing/atomic-testing/issues/1048)).

1.0 freezes the public API ([ADR-006](006-1.0-api-freeze-and-evolution.md)). The
reversibility here is **asymmetric**:

- Widening a member from `protected` to `public` later is **non-breaking** —
  existing callers keep working.
- Narrowing a member from `public` to `protected` later is **breaking** — it
  removes something callers may depend on.

So the conservative 1.0 choice is to ship these primitives `protected` and widen
any that earn a public use case, rather than freeze the whole uniform surface and
be unable to take it back.

## Decision

Ship the raw low-level primitives as `protected` on `ComponentDriver`; keep only
the semantic, intended actions public.

**Narrowed to `protected`:** `mouseMove`, `mouseDown`, `mouseUp`, `mouseOver`,
`mouseOut`, `mouseEnter`, `mouseLeave`, `contextMenu`, `activate`, `scrollBy`,
`dragTo`, `drag`, `getBoundingRect`, `innerHTML`.

**Kept public (semantic actions and reads):** `click`, `hover`, `focus`,
`pressKey`, `scrollIntoView`, `isVisible`, `getText`, `getAttribute`, `exists`,
the `waitUntil*` family, `runtimeCssSelector`, and the driver-model members
(`parts`, `locator`, `interactor`, `commutableOption`, `driverName`, the static
portal hooks).

Concrete drivers still compose the narrowed primitives internally: they remain
callable on `this`, and a driver that needs a child part's primitive drives it
through the interactor against the child's resolved locator —
`this.interactor.<primitive>(this.parts.<child>.locator, …)` — since a
`protected` member is not reachable on a sibling driver instance of another
class.

## Consequences

- ✅ The frozen public driver surface is the semantic API only; the raw gestures
  are an internal composition detail that can be widened case by case without a
  breaking change.
- ✅ The engine root no longer advertises a pile of primitives that are
  meaningless (and were crash-prone) at the scene root.
- ⚠️ Breaking for any external caller that invoked a now-`protected` primitive
  directly on a driver instance — intended, and done now, before the 1.0 tag.
- ℹ️ All in-repo callers resolved cleanly through the interactor, so **no method
  needed a public-surface exception**: the shipped drivers
  (`DialogDriver` in `component-driver-mui-v6/-v7/-v9` used `mouseDown`/`mouseUp`
  on the dialog container; `SliderDriver` in `component-driver-primevue-v4` and
  `component-driver-radix-v1` used `drag` on the handle/thumb) and the driver
  test suites (mouse-event, drag, scroll, activate, context-menu, geometry,
  scroll-area, nav-icon) now call the interactor with the child's `locator`.
- ℹ️ The generated API reference already partitions members into own / inherited
  / protected sections, so the narrowed members surface there as `protected`; the
  committed `etc/core.api.md` report is regenerated to match.

## Alternatives considered

| Alternative                                                  | Why not chosen                                                                                                                               |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Keep every primitive public, document intent in prose        | Freezes a large uniform surface at 1.0 that is breaking to narrow later; a doc note cannot un-freeze it.                                     |
| Remove the primitives from `ComponentDriver` entirely        | Drivers legitimately compose them; removing them would push the raw-gesture logic into every driver and duplicate the interactor delegation. |
| Split the primitives onto a separate opt-in mixin/base class | Speculative structure for no present need; the `protected` narrowing achieves the surface goal with a far smaller, right-sized change.       |

## Related

- [ADR-006](006-1.0-api-freeze-and-evolution.md) — the 1.0 API freeze this serves.
- [#1048](https://github.com/atomic-testing/atomic-testing/issues/1048) — the engine-root crash that motivated auditing the inherited surface.
- Issue #1045.
