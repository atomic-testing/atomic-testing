# ADR-011: Retract the locator descriptive `source` AST from the public surface

## Status

Accepted (2026-06-29). Part of the 1.0 freeze. Decision **D5** of the core gap audit (issue #966).

## Context

Every locator builder populates a descriptive `source` AST — `byRole` sets
`{ _id: 'byRole', value, relative }`, and so on — and `CssLocator` exposed it
through `public get source(): Optional<CssLocatorSource>`. But:

- `.source` was **never read** for reinterpretation anywhere in the codebase.
- `CssLocatorSource` and every `By*Source` member were **not exported** from the
  barrel, so the getter returned an **unnameable** type — a public getter whose
  return type a consumer cannot even spell.
- It is the load-bearing piece for the project's stated "reinterpret a locator to
  a non-CSS engine" goal (the TODO in `byInputType.ts`) — which has **no consumer
  yet**.

Freezing this at 1.0 would lock a half-built AST shape into the stable surface via
a getter nobody can use.

## Decision

**Retract** (option (b)): drop the public `source` getter and keep the `_source`
AST **private**, preserved through `clone()`. The redesign substrate survives —
the builders still construct it and it rides along on clones — but its shape is no
longer frozen into the 1.0 surface. `CssLocatorSource` and the `By*Source` union
stay unexported.

The getter was the only public **read** of the AST and the only public reference
to the unexported `CssLocatorSource`; removing it eliminates both (the
`ae-forgotten-export` note for `CssLocatorSource` is gone from the report).
`LinkedCssLocator` never carried a `source`, so its `clone()` no longer needs to
read the removed getter.

If reinterpretation actually ships post-1.0, the source surface can be designed
and committed **deliberately** then (export the types, document `_id` as the
stable discriminant, build the consumer) — additively, unconstrained by a
prematurely-frozen getter.

## Consequences

- ✅ No public getter returns an unexported type; the `CssLocatorSource`
  forgotten-export is resolved.
- ✅ Redesign freedom preserved — the build-time AST is still constructed and
  retained privately, with zero behavior change.
- ⚠️ `CssLocatorInitializer` remains a constructor-/`clone()`-parameter
  forgotten-export. That is a construction detail, not a stable read API, and is
  the separate pre-existing cleanup [ADR-006](006-1.0-api-freeze-and-evolution.md)
  flagged as follow-up — out of scope here.

## Alternatives considered

| Alternative                                                                                                                                | Why not chosen                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Commit** (opt. a): export `CssLocatorSource` + `By*Source`, build a reinterpretation consumer, document `_id` as the stable discriminant | No consumer ships at 1.0; committing would freeze an AST shape we would most likely redesign once reinterpretation is actually built.    |
| Keep the getter but tag it `@internal`                                                                                                     | The report still records `@internal` members, so the unnameable-return-type getter would remain in the surface; full removal is cleaner. |

## Related

- [ADR-006](006-1.0-api-freeze-and-evolution.md) — the freeze, and the forgotten-export cleanup note this partially resolves.
- [ADR-008](008-css-dom-only-locator-boundary.md) — the CSS-only boundary; reinterpretation to a non-CSS engine would be the future this AST serves.
- Issue #966; the `byInputType.ts` reinterpretation TODO.
