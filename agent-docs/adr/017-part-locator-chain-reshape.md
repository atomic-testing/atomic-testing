# ADR-017: PartLocator reshape — always a chain, `.and()` moves to `locatorUtil`

## Status

Accepted (2026-07-21). Implements the 2.0-scale reshape tracked by #1058.

## Context

`PartLocator` was `CssLocator | CssLocator[]` — a single locator OR a chain of
them. Every consumer that needed to walk a locator's elements (`locatorUtil`'s
internals, and driver code re-rooting at an ancestor via `:has()`) first had to
normalize the union with `isChain`/`toChain`:

```ts
const chain = locatorUtil.toChain(this.locator);
const self = chain[chain.length - 1].selector;
```

Separately, `CssLocator.chain(...)` duplicated what `locatorUtil.append(...)`
already did, and `CssLocator.and(...)` — same-element composition — was an
instance method that only worked because a `by*` builder happened to return a
bare `CssLocator`, never a chain.

Because `PartLocator` is public API, collapsing the union is a breaking change
and was deliberately deferred past the 1.0 freeze (see the note this issue
added to `PartLocator.ts` and [ADR-008](008-css-dom-only-locator-boundary.md)
when the additive `'Child'` position shipped).

## Decision

**Collapse `PartLocator` to always be a chain: `type PartLocator = CssLocator[]`.**
A locator built from a single `by*` call is simply a one-element chain — there
is no separate "bare locator" shape left to normalize.

Consequences of that single change, threaded through the model:

1. **Every `by*` builder returns `PartLocator`** (a one-element chain), not a
   bare `CssLocator`. `ScenePart.locator` and every other `PartLocator`-typed
   slot already expected `PartLocator`, so this is source-compatible at every
   call site that just passes a builder's result along — the break is confined
   to code that typed a builder's result as `CssLocator` or called a
   `CssLocator`-only instance method on it directly.
2. **`isChain`/`toChain` are removed.** `locatorUtil`'s internals
   (`append`, `findRootLocatorIndex`, `toPrimitiveLocators`,
   `overrideLocatorRelativePosition`, …) and the driver code that re-roots at an
   ancestor (`CheckboxDriver`, `SearchBoxDriver`, `InfoButtonDriver`,
   `InfoLabelDriver`) drop the normalization call entirely — `this.locator` is
   already the chain.
3. **`CssLocator.chain()` is removed** — it duplicated `locatorUtil.append()`,
   which is the sole surviving way to concatenate chains.
4. **`CssLocator.and()` moves to `locatorUtil.and(base, ...matchers)`.** Once
   builders return chains, there is no guaranteed single-`CssLocator` receiver
   for an instance method to live on. `and()` requires `base` and every matcher
   to each be a one-element, `'primitive'`-complexity chain (exactly what a
   fresh `by*` call produces) and throws otherwise — the same guarantee the old
   instance method gave, just checked at the chain boundary instead of assumed
   by the receiver's type. See [ADR-007](007-interactor-evolution-and-composition.md)
   for why composition lives at the locator layer at all; this ADR only moves
   _where_ `.and()` lives, not that decision.

## Alternatives considered

| Alternative                                                                        | Why not chosen                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wrap `PartLocator` in a class (`{ chain: CssLocator[] }`) instead of a plain array | Would let `.and()` stay an instance method, but every existing test/driver that manipulates a locator with plain array methods (`.slice()`, `.concat()`, `.length`, array literals in tests) would need converting to go through a `.chain` accessor first — a larger, less mechanical diff for no behavioral gain over a free function. |
| Leave `.and()` on `CssLocator`, keep builders returning bare `CssLocator`          | Contradicts the reshape itself — `PartLocator` would still need the union to accept a bare builder result, which is exactly what #1058 asks to eliminate.                                                                                                                                                                                |
| Keep `CssLocatorChain` as a separate exported alias for `CssLocator[]`             | `PartLocator` and `CssLocatorChain` would be the same type under two names once the union collapses — a redundant public export with no distinct meaning.                                                                                                                                                                                |

## Consequences

- ✅ No more `isChain`/`toChain` normalization at any consumer — a `PartLocator`
  is always directly indexable/sliceable/concatenable.
- ✅ `CssLocator.chain()`'s duplication of `locatorUtil.append()` is gone.
- ✅ The `'Child'` relative position (the other half of #1058, shipped pre-1.0-freeze
  close) composes identically through both `append` and `and`.
- ⚠️ Breaking change for any external consumer that typed a builder's result as
  `CssLocator` or called `.and()`/`.chain()` as an instance method — expected and
  accepted, since this is explicitly a 2.0-scale change (see #1058).

## Related

- [ADR-006](006-1.0-api-freeze-and-evolution.md) — the 1.0 freeze this reshape waited out.
- [ADR-007](007-interactor-evolution-and-composition.md) — why composition lives at the locator layer; superseded here only on _where_ `.and()` lives.
- [ADR-008](008-css-dom-only-locator-boundary.md) — the CSS/DOM-only boundary this reshape stays within.
- Issue #1058 (this decision).
