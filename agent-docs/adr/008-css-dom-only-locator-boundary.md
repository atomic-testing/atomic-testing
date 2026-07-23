# ADR-008: The 1.0 locator boundary is CSS- and DOM-only

## Status

Accepted (2026-06-29). Part of the 1.0 freeze. Decision **D2** of the core gap audit (issue #963).

## Context

Every locator in the system reduces to a single CSS string through
`locatorUtil.toCssSelector`, which is then handed to `document.querySelector`
(jsdom) or `page.locator(css)` (Playwright). Concretely:

- The locator set is **closed to CSS**: every builder (`byRole`, `byAriaLabel`,
  `byAttribute`, `byDataTestId`, `byCssSelector`, …) emits a CSS fragment, and the
  only locator verb the `Interactor` exposes is "turn this into CSS".
- `byRole` / `byAriaLabel` are themselves just CSS attribute matchers
  (`[role="…"]`, `[aria-label="…"]`).
- There is **no seam** for an XPath / text / computed-accessible-name engine, nor
  for a non-DOM target.

This was an _implicit_ boundary. Freezing the surface at 1.0 forces the question:
do we bless the CSS/DOM-only model, or introduce an indirection now so locators
could later resolve through engine-native handles (required for non-DOM)?

## Decision

**Declare 1.0 deliberately DOM- and CSS-only, and document the boundary
explicitly** (option (a)). The boundary is now stated in the TSDoc of the two
public contract types and the one resolution seam:

- `Interactor` — methods resolve via a single CSS selector run against a DOM; no
  non-DOM seam; computed accessible names out of scope.
- `PartLocator` — always reduces to one CSS selector; the locator model is closed
  to CSS for 1.0; `byCssSelector` is the raw-CSS escape hatch and
  {@link locatorUtil.and} composes same-element matchers (moved off
  `CssLocator.and` in the 2.0 chain reshape — see
  [ADR-017](017-part-locator-chain-reshape.md)).
- `locatorUtil.toCssSelector` — the single, CSS-only resolution seam.

What stays **in** scope (all CSS): attribute/role/state matchers, same-element
composition via `CssLocator.and`, and the `byCssSelector` raw escape hatch.

What is **out** of scope for 1.0: computed ARIA accessible names
(`aria-labelledby` / associated `<label>` / text content — not CSS-expressible),
XPath, text-content engines, and non-DOM environments.

We do **not** introduce a `resolve(locator)` indirection now (option (b)). That
would be speculative abstraction with no present consumer; the one genuine gap —
the computed accessible name — is addressed **additively** post-1.0 via an
optional `Interactor` member per
[ADR-007](007-interactor-evolution-and-composition.md), not by reworking the
locator model. The verbatim role+name case is already covered by `CssLocator.and`.

> **Update ([ADR-018](018-findbyrole-accessible-role-locator.md), #923).** The computed-name
> gap is now closed by `findByRole`, still without the general `resolve(locator)` indirection
> this ADR declined: `AccessibleRoleLocator` subclasses `CssLocator` (so `PartLocator` stays
> `CssLocator[]`, unchanged), and each interactor detects it BEFORE the CSS seam
> (`locatorUtil.splitAtAccessibleRoleLocator`) rather than through a general non-CSS resolve
> path. The "no seam for a non-DOM target" boundary this ADR declares is otherwise untouched.

## Consequences

- ✅ The boundary is explicit in docs + ADR, not implicit — consumers know exactly
  what the locator model can and cannot express.
- ✅ No speculative indirection added to the frozen surface.
- ⚠️ If a non-DOM environment ever becomes a real ambition, adding the
  `resolve(locator)` indirection would be a breaking `Interactor` change requiring
  a major release. That is the accepted, documented cost of choosing the simpler
  model now; the computed-name gap, by contrast, stays additive (ADR-007).

## Alternatives considered

| Alternative                                             | Why not chosen                                                                                                                                            |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Introduce a `resolve(locator)` indirection now (opt. b) | Speculative — no present non-DOM consumer; adds a layer to the frozen surface for a hypothetical future. Re-evaluate if/when non-DOM becomes a real goal. |
| Leave the boundary implicit (status quo)                | The freeze is the moment to make limits explicit; an undocumented boundary invites Hyrum's-Law assumptions about XPath/accname support that do not exist. |

## Related

- [ADR-007](007-interactor-evolution-and-composition.md) — `CssLocator.and` (verbatim role+name) and the additive path for the deferred computed-name resolution.
- [ADR-001](../../docs/adr/0001-interactor-primitives-and-name-aware-role.md) — Decision B: why the computed accessible name is not CSS-expressible (#923).
- [ADR-006](006-1.0-api-freeze-and-evolution.md) — the freeze that prompts making this boundary explicit.
- Issues #963 (this decision), #923 (computed-name resolution).
