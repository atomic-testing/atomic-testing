# ADR-020: Postcondition ownership — driver vs. suite

## Status

Accepted (2026-08-18). Documents a doctrine already applied across four changes —
`ComponentDriver.awaitPostcondition` itself plus its `reka-ui-v2` `SelectDriver`,
`mui-x-v9` `PickerFieldDriverBase.clearField`, and `angular-material-v20/21/22`
`TabsDriver` call sites (all landed together); the Angular Material
`CheckboxDriver`/`RadioGroupDriver` split that motivated writing this down; and
`SlideToggleDriver`'s reconciliation onto the same helper. Recorded now because the
next driver fix that looks like a race needs a rule to apply, not four `git blame`s to
re-derive one.

## Context

`awaitPostcondition` (`packages/core/src/drivers/ComponentDriver.ts:470`) exists
because an interactor settles its framework's scheduler after a write and then
treats the DOM as final, but a component that finishes its own DOM work after that
point — a deferred `setTimeout`, a change-detection pass that lands later — leaves
the next single-shot read observing a transient state. Its TSDoc covers the
_mechanism_ well: why the wait belongs on the action rather than on a retrying read
or a fixed macrotask drain. What it does not and should not cover is a different
question that only comes up once a driver actually needs it: **which unmet
conditions is a driver entitled to promise in the first place?**

That question was easy to get wrong in exactly the way that matters. Investigating
two Angular Material CI flakes that looked identical —

- Checkbox: `setSelected(true) resolves an indeterminate checkbox to checked` failed
  with `Expected: false, Received: true`.
- Radio: `setValue … reaches the change handler` failed with
  `Expected: "chocolate", Received: "initial"`.

— found they were not the same defect. The checkbox failure was `aria-checked`
lagging a change-detection pass behind `CheckboxDriver.isIndeterminate`'s own read
(`packages/component-driver-angular-material-v21/src/components/CheckboxDriver.ts`,
before this fix) — component state, reachable from the driver's own locator, that
the driver already reads. The radio failure was an `<output>` the _example
application_ writes from its own `(change)` handler — state no driver references at
all.

Writing a postcondition for the radio case the same way as the checkbox would have
been worse than doing nothing: `RadioGroupDriver`'s checked locator is `:checked`
and `RadioButtonDriver.isSelected` reads `input.checked`
(`packages/component-driver-angular-material-v21/src/components/RadioButtonDriver.ts`),
both flipped by the browser as the click's default action, before Angular runs. A
postcondition probing either would be **satisfied on its first probe, add no wait at
all, and still leave the real assertion racing the app's render** — passing review
as a fix while fixing nothing. That failure mode doesn't announce itself; it looks
identical to a correct fix until someone traces the actual DOM signal each read
depends on.

## Decision

Before reaching for `awaitPostcondition`, classify the unmet condition. Three
questions, in order:

**1. Is the value already correct, just mirrored somewhere that lags?** Some
component state is set by the **browser itself**, as the native default action of
the interaction — a checkbox's `:indeterminate` IDL slot, a radio's `:checked`
pseudo-class, an input's `.value` after typing — and is therefore correct the
instant the action resolves, before any framework render pass runs at all. A
framework may _also_ render an ARIA mirror of that same fact (`aria-checked="mixed"`
driven by `[attr.aria-checked]="indeterminate ? 'mixed' : null"`), and that mirror
_can_ lag. If a read is racing the mirror, don't wait for the mirror to catch up —
**read the browser-owned signal instead.**
`CheckboxDriver.isIndeterminate` (`.../CheckboxDriver.ts:77-79`) does this: it moved
from `aria-checked` to `:indeterminate`, which removes the race rather than
outwaiting it. No probe, no timeout to tune, strictly stronger than a postcondition
on the same driver would have been.

**2. If not, does the driver's own read reach it?** If the state is a genuine
property of the component the driver drives — reachable from the driver's own
locator, and either already exposed by a read on the driver or naturally would be —
the driver can promise it. Wrap the action with `awaitPostcondition`, following the
shipped idiom (see below). `TabsDriver.awaitSelected`
(`packages/component-driver-angular-material-v21/src/components/TabsDriver.ts:167-169`)
is the clean case: `aria-selected` is real component state the driver already reads
via `tab.isSelected()`, propagated through change detection with no browser-native
shortcut available — question 1 doesn't apply, question 2 does.

**3. Otherwise, it's not the driver's to promise.** State written by the
_consuming_ application — an echoed `<output>`, a side effect in a handler, anything
outside the driver's own locator subtree — cannot be named by a driver postcondition
at all, and attempting one risks the vacuous-pass failure mode from Context. This
belongs at the suite level: a bounded `waitUntil` probe on the read that actually
needs to settle, colocated with the assertion it guards, matching the existing
`Checkbox.suite.ts` `termsState` precedent and the `Radio.suite.ts` `flavorState`
probe added alongside this doctrine.

**The shipped idiom, for question 2.** Every driver-level call site follows the
same shape:

```ts
private async awaitSelected(tab: TabDriver, postcondition: string): Promise<void> {
  await this.awaitPostcondition(postcondition, () => tab.isSelected());
}
```

— a `private async await<X>` helper, called as the action's last statement; the
postcondition string phrased as the state that must arrive (`"the tab at index ${i}
to report itself selected"`), not the action taken; no explicit `timeoutMs` unless
the next paragraph applies. `reka-ui-v2`'s `awaitSelectionCommitted`
(`SelectDriver.ts:272-273`) and `mui-x-v9`'s inline call in `clearField`
(`PickerFieldDriverBase.ts:153`) are the other two original shapes this generalizes
from.

**A timeout trap worth naming explicitly.** `awaitPostcondition` defaults to
`defaultWaitForOption.timeoutMs` (30s), shared across the library so every wait
answers to one flake-tolerance knob (#1057). That default can exceed a test
runner's _own_ per-test timeout — this package's Vitest browser-mode tests use the
5s default, with no `testTimeout` override. When it does, the runner kills the test
before `PostconditionNotMetError` ever gets a chance to report the real cause,
defeating the entire point of a named diagnostic. `SlideToggleDriver.awaitToggled`
(`SlideToggleDriver.ts:73-79`) passes an explicit `{ timeoutMs: 1000 }` for exactly
this reason — check the runner's bound before leaving a postcondition on the
library default.

## Consequences

- ✅ A future driver fix that looks like a flaky-state race has a decision
  procedure instead of a fresh investigation: dissolve it if the browser already
  owns the value, promise it if the driver's own read reaches it, probe it in the
  suite if it doesn't.
- ✅ The vacuous-postcondition failure mode — a wait that passes on its first probe
  because the signal it checks was never actually lagging — has a name and a worked
  example (Radio) to check new call sites against.
- ⚠️ This doctrine is judgment, not a linter. Nothing enforces "did you check
  question 1 before question 2" mechanically; a reviewer still has to ask whether a
  new `awaitPostcondition` call site is probing browser-owned, framework-rendered,
  or app-owned state.
- ℹ️ **Known, not yet applied.** `SelectDriver`, `AutocompleteDriver`, `MenuDriver`,
  `MenuItemDriver` and others across Angular Material, Fluent, Astryx, MUI and
  PrimeVue hand-roll `waitUntil` probes structurally similar to
  `SlideToggleDriver`'s pre-fix shape — risk markers per the earlier flakiness
  audit, not confirmed defects. Each is a candidate for this same three-question
  triage, not a blanket conversion; see the "Alternatives considered" row below for
  why a batch migration wasn't attempted here.

## Alternatives considered

| Alternative                                                                  | Why not chosen                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Driver-only: postcondition every case, including Radio                       | Provably vacuous for Radio (`:checked`/`input.checked` are browser-set, so the probe never actually waits) — would have shipped a fix that fixes nothing and reads as one. The general version of this mistake is what question 1 and the Context section exist to prevent.                                                                                                                                        |
| Suite-only: probe everything, change no driver                               | Leaves the real Checkbox defect in the library — every downstream consumer independently rediscovers that `aria-checked` lags and writes its own probe. Contradicts the standing rule (`diagnose-test-failure` skill) that a wait every caller needs belongs inside the driver, not repeated at each call site.                                                                                                    |
| A CSS-class postcondition on Radio (e.g. Material's `mat-mdc-radio-checked`) | Would have made the driver-only option non-vacuous, but at the cost of a real DOM signal — it violates this package's own locator policy (`.../TabsDriver.ts` documents drivers as located by accessible role, not Material class names) for no gain the browser-owned state doesn't already provide for free.                                                                                                     |
| `assertEventuallyEqual` on `TestFrameworkMapper`                             | A real option for consolidating the ~50 hand-rolled suite echo-probes across the Angular Material packages into one named idiom, rather than the ad-hoc `waitUntil` + magic timeout each currently uses. Deferred rather than rejected: it's new shared API to fix two failing tests, and worth doing deliberately as its own change if the hand-rolled-probe count keeps growing, not folded into a bug-fix diff. |

## Related

- [ADR-006](006-1.0-api-freeze-and-evolution.md) — `core`'s frozen API set;
  `awaitPostcondition` and `PostconditionNotMetError` shipped as additive,
  minor-compatible surface under it.
- [ADR-010](010-narrow-error-payload.md) — the narrow-payload rule
  `PostconditionNotMetError` follows (`driverName` + description only, never a live
  driver or locator).
- `packages/core/src/drivers/ComponentDriver.ts` — `awaitPostcondition` and its
  TSDoc, which covers the mechanism this ADR assumes.
- `packages/core/src/errors/PostconditionNotMetError.ts`
- `packages/core/src/drivers/__tests__/ComponentDriver.test.ts` — covers
  `awaitPostcondition`'s success and timeout paths, including the throw path
  end-to-end verification structurally cannot reach.
- `scripts/check-angular-material-parity.mjs` — the adjacent gate ensuring a fix
  built under this doctrine on one Angular Material major actually reaches all
  three.
