# ADR-018: `findByRole` — a second, non-CSS resolution channel via `AccessibleRoleLocator`

## Status

Accepted (2026-07-23). Implements the follow-up wave [ADR 0001](../../docs/adr/0001-interactor-primitives-and-name-aware-role.md)
Decision B deferred, and the additive path [ADR-007](007-interactor-evolution-and-composition.md)
and [ADR-008](008-css-dom-only-locator-boundary.md) left open for it. Resolves #923.

## Context

`byRole` + `byAriaLabel` (composed via `locatorUtil.and`) cover role + **verbatim**
`aria-label` disambiguation, but not the common case where a control's accessible name is
**computed** — from `aria-labelledby`, an associated `<label>`, or (the Astryx default)
plain visible text content. That computation is a multi-node graph traversal (the W3C
accname algorithm) with no CSS expression, so it cannot be added as another `CssLocator`
variant without breaking the CSS/DOM-only invariant ADR-008 declared for 1.0.

ADR-007 anticipated this: computed-name resolution was deferred but declared **safe to add
post-1.0** as either a default-bearing `DOMInteractor` method or an optional `Interactor`
member — "a second resolution channel," not a locator-model rework. This ADR ratifies the
concrete shape that channel takes.

## Decision

### 1. `AccessibleRoleLocator` — a `CssLocator` subclass with no CSS

`findByRole(role: string, name?: string, relative?: LocatorRelativePosition): PartLocator`
(`packages/core/src/locators/findByRole.ts`) returns a one-element chain wrapping a new
`AccessibleRoleLocator` (`packages/core/src/locators/AccessibleRoleLocator.ts`), which
extends `CssLocator` — following the precedent `LinkedCssLocator` already set for a locator
kind that cannot resolve to CSS at build time. Its `selector` is a **diagnostic-only**
string (`role=button name="Save"`) for error messages; it is never run as CSS. A new
`LocatorComplexity` value, `'accessibleRole'`, distinguishes it from `'primitive'` — which
means `locatorUtil.and()`'s existing "primitive chains only" guard already rejects
composing it into a same-element CSS compound, with no new code.

Subclassing `CssLocator` (rather than widening `PartLocator` to a new union) keeps
`PartLocator = CssLocator[]` intact post the 2.0 reshape (ADR-017) — every `by*`/`findByRole`
builder still returns the same chain shape, and every existing consumer that indexes/slices
a `PartLocator` keeps working unmodified.

### 2. Resolution splits the chain BEFORE the CSS seam, not inside it

`locatorUtil.splitAtAccessibleRoleLocator(locator)` (`packages/core/src/utils/locatorUtil.ts`)
finds the `AccessibleRoleLocator` segment, if any, and returns `{ before, roleLocator }` —
`before` is the CSS-resolvable prefix (the scope an accname search runs within); the segment
must be the chain's LAST element, since there is no CSS expression for "descendant of an
accname match," so anything appended after it throws `LocatorResolutionError` at split time,
not as a confusing downstream CSS parse failure.

`toCssSelector` itself now throws the same clear error if handed a chain containing this
segment — a defense-in-depth guard for any caller that bypasses the interactor and calls
`toCssSelector` directly, keeping the "CSS-only" contract of that one function honest rather
than silently emitting the diagnostic string as if it were real CSS.

### 3. Each interactor resolves the segment via its own accname engine

- **`DOMInteractor.getElement`** (the sole jsdom resolution seam every primitive already
  routes through) checks `splitAtAccessibleRoleLocator` first. When present, it resolves
  `before` by RECURSING into itself (reusing 100% of the existing CSS/`'Root'`-escape/
  `LinkedCssLocator` logic with no duplication) to a single scope element, then runs
  `@testing-library/dom`'s `queryAllByRole(scopeEl, role, { hidden: true, name })` — a
  dependency `dom-core` already carried for this exact purpose. Because `getElement` is the
  one seam, EVERY DOMInteractor primitive (`click`, `pressKey`, `drag`, …) gains
  `findByRole` support for free, and `ReactInteractor`/`VueInteractor` inherit it unwrapped
  (no new mutating primitive was added; existing ones just resolve differently).
- **`PlaywrightInteractor`** had no equivalent single seam — roughly two dozen methods each
  independently reduced their locator to a CSS string via `locatorUtil.toCssSelector` and
  called `this.page.locator(css)`. This ADR introduces `resolveLocator(locator): Promise<Locator>`
  as that missing seam and routes every primitive through it. For the non-`findByRole` path
  it is behaviorally IDENTICAL to the code it replaces (`toCssSelector` → `page.locator(css)`);
  for the `findByRole` path it resolves `before` (recursively, `.first()`ed so a multi-match
  scope agrees with `DOMInteractor`'s single-element scope) and calls Playwright's own
  accname-aware `Locator.getByRole`/`Page.getByRole`.

### 4. No `exact` option — always exact, case-sensitive, in both engines

The ADR 0001 sketch proposed `findByRole(role, { name, exact })`. Empirical verification
during implementation found `@testing-library/dom`'s `getByRole` has **no fuzzy-match mode**
for a string `name` — its `matches()` helper does a plain `===` comparison, always exact and
case-sensitive — while Playwright's `getByRole` defaults to case-insensitive substring
matching and only becomes exact via `exact: true`. Shipping an `exact` toggle that only ONE
engine could honor would be a correctness trap for a library whose entire contract is "the
same suite runs identically in both environments." Instead, `findByRole` drops `exact`
entirely, and `PlaywrightInteractor.resolveLocator` unconditionally passes `exact: true`
whenever a `name` is given — matching jsdom's only mode, verified identical (Playwright's
`exact: true` is documented as "case-sensitive and whole-string," the same semantics as
`@testing-library/dom`'s `===`).

### 5. `findByRole` is documentation-distinct from `byAriaLabel`

Both resolve role + name, but for different name sources: `byAriaLabel` (CSS,
`[aria-label="…"]`) matches only the literal attribute; `findByRole` (accname) matches the
COMPUTED name — text content, `<label>`, `aria-labelledby` — which is the common case for a
design system that labels controls with visible text. `findByRole`'s TSDoc, `byAriaLabel`'s
TSDoc, and the docs site's locator table (`docs/docs/core-concepts.mdx`) each cross-reference
the other so a reader picks the right one instead of discovering the gap by a failed match.

## Consequences

- ✅ Every `DOMInteractor`/`ReactInteractor`/`VueInteractor` primitive supports `findByRole`
  locators with a single, centralized code change (`getElement`).
- ✅ Every `PlaywrightInteractor` primitive supports `findByRole` locators too, via the new
  `resolveLocator` seam — but this was the largest mechanical diff of the wave (~20 call
  sites moved off inline `toCssSelector`+`page.locator`), carrying real regression risk for
  a shared primitive (see the root `CLAUDE.md` "Shared-primitive blast radius" note). Verified
  via the full component-driver-html-test DOM (jsdom) and E2E (Chromium) suites, plus a
  cross-package sweep (MUI, PrimeVue, Radix DOM suites; the Angular Material v22 browser-mode
  suite) — all green with zero behavioral change on the non-`findByRole` path.
- ✅ `locatorUtil.and()` rejects composing an `AccessibleRoleLocator` for free (distinct
  `complexity`), and `toCssSelector` rejects one directly for a clear failure instead of
  silent garbage CSS.
- ⚠️ `findByRole` must be the chain's terminal segment — no CSS locator can follow it. This
  is a real, documented limitation (not every conceivable composition is supported), matching
  the "second resolution channel, contained crack in the CSS-only invariant" ADR 0001
  anticipated rather than a general-purpose non-CSS locator engine.
- ⚠️ No `exact`/fuzzy-match option, by design (see Decision 4) — a caller needing a
  substring/fuzzy match must currently use a different strategy (e.g. a regex `name` is not
  exposed either, for the same cross-engine-parity reason; revisit if a real need surfaces).

## Alternatives considered

| Alternative                                                                                                    | Why not chosen                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `findByRole(role, options?): Promise<PartLocator>` (the ADR 0001 sketch)                                       | Would make every `ScenePart` locator declaration async and require an interactor at locator-BUILD time, breaking the "locators are pure, declared statically" pattern every other builder follows.                 |
| Widen `PartLocator` to `(CssLocator \| AccessibleRoleLocator)[]`                                               | `AccessibleRoleLocator extends CssLocator` achieves the same "distinguishable segment" outcome with ZERO type-surface change to `PartLocator`, `and()`, `append()`, or any existing consumer that indexes a chain. |
| Expose `exact`/fuzzy matching, defaulting to Playwright's fuzzy substring mode                                 | jsdom cannot honor fuzzy string matching at all (no such mode in `@testing-library/dom`'s `getByRole`) — the two engines would silently diverge on results, undermining the shared-suite contract.                 |
| Resolve `findByRole` results server-side into a synthesized CSS attribute (e.g. inject a temp `data-*` marker) | Requires mutating the DOM under test to make it locatable — a correctness/side-effect risk (and impossible read-only) rejected outright.                                                                           |

## Related

- [ADR 0001](../../docs/adr/0001-interactor-primitives-and-name-aware-role.md) — Decision B, the original design sketch this implements (with the two documented deviations above).
- [ADR-007](007-interactor-evolution-and-composition.md) — the additive-growth mechanism (`DOMInteractor` default method / optional member) this follows.
- [ADR-008](008-css-dom-only-locator-boundary.md) — the CSS/DOM-only boundary this is the one deliberate, documented crack in.
- [ADR-017](017-part-locator-chain-reshape.md) — the `PartLocator = CssLocator[]` shape this locator subclasses into without widening.
- Issues #923 (this decision), #909 (Astryx umbrella).
