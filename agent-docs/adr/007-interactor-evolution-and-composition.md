# ADR-007: Interactor evolution strategy & same-element locator composition

## Status

Accepted (2026-06-29). Resolves the §6 deferral in [ADR-006](006-1.0-api-freeze-and-evolution.md); part of the 1.0 freeze. Decision **D1** of the core gap audit (issue #962).

## Context

[ADR-006](006-1.0-api-freeze-and-evolution.md) §6 fixed a _constraint_ — post-1.0
`Interactor` growth must be **additive without breaking implementers** — but
deferred the _mechanism_ to this decision. Two concrete questions were open:

1. **How does the flat `Interactor` interface evolve safely?** It is an
   all-required interface of ~40 members. Adding any required member after 1.0 is
   a compile-breaking change for anyone who `implements Interactor` by hand. The
   interface is also the typing/consumption contract for every driver, so it
   cannot simply be made fully optional.
2. **Should a bespoke `findByRole` primitive land before the freeze?** The Astryx
   work (#909) needs role + accessible-name selection. [ADR-001](../../docs/adr/0001-interactor-primitives-and-name-aware-role.md)
   designed an accessible-name-correct `findByRole` but deliberately deferred its
   implementation to a follow-up wave (#923) because the _computed_ accessible
   name is not CSS-expressible. Adding a required `Interactor` method post-freeze
   is exactly the break question (1) is about, so the timing matters.

The shipped interactors do **not** all extend the same base, which shapes the
answer:

| Interactor              | Relationship      | Why                                                               |
| ----------------------- | ----------------- | ----------------------------------------------------------------- |
| `DOMInteractor`         | `implements`      | The jsdom base every other DOM-family adapter extends.            |
| `ReactInteractor`       | `extends DOM`     | Wraps mutations in `act()`.                                       |
| `VueInteractor`         | `extends DOM`     | Awaits `nextTick()`.                                              |
| `LegacyReactInteractor` | `extends DOM`     | React 16/17 `act` via `react-dom/test-utils`.                     |
| `PlaywrightInteractor`  | `implements` bare | Browser backing shares **no** implementation with the jsdom base. |

## Decision

### 1. The blessed extension path is "extend `DOMInteractor`"

Adapter authors — especially third parties — should **extend `DOMInteractor`**,
not `implement Interactor` bare. Extenders inherit a working default for every
current member, and crucially for every member added in a future **minor**: a new
method landed on the base is inherited automatically, so the addition is
non-breaking for everyone on the blessed path.

`PlaywrightInteractor` implements `Interactor` bare on purpose — its browser
backing reuses none of the jsdom implementation, so there is nothing to inherit.
It is first-party and shipped in lockstep, so it is updated in the same change
that adds a member and never relies on the inheritance guarantee. Hand-written
bare implementations are still _supported_, but they accept the additive-break
risk; the docs steer external authors to the extension path instead.

Post-1.0 `Interactor` growth therefore follows this priority order:

1. **Add to `DOMInteractor` with a working default.** Extenders inherit it;
   first-party bare implementers (`PlaywrightInteractor`) are updated in the same
   release. Non-breaking for the blessed path and for external extenders.
2. **If no sensible default exists, add an _optional_ interface member**
   (`method?(...): ...`) and document the capability-detection convention
   (`if (interactor.method) { … }`). Optional members never break even bare
   implementers.
3. **Capability detection / feature flags** as the fallback for cross-cutting
   additions.

The bare `Interactor` interface remains the typing and consumption contract; this
decision governs how it _grows_, not whether it exists.

### 2. No bespoke `findByRole` before 1.0 — compose at the locator layer instead

The common need behind `findByRole` is "a `role` plus a verbatim accessible name
on the same element". That is pure CSS, so it is met at the **locator** layer, not
by a new `Interactor` method:

`CssLocator.and(...)` compounds same-element matchers into one selector —
`byRole('button').and(byAriaLabel('Open'))` → `[role="button"][aria-label="Open"]`.
It supersedes the previous `locatorUtil.append(byRole('button'), byAriaLabel('Open', 'Same'))`
form (no `'Same'` argument to remember, no wrapper) and stays entirely within the
CSS/DOM-only boundary declared in [D2 (#963)](008-css-dom-only-locator-boundary.md).

The _computed_ accessible name (`aria-labelledby` / associated `<label>` / text
content) is genuinely not CSS-expressible and remains deferred to **#923**. Under
Decision 1 it is now safe to add after 1.0 — as a default-bearing method on
`DOMInteractor`, or an optional member — without a breaking change.

### 3. Conformance seam

The seam an external adapter must satisfy is "extends `DOMInteractor` (or
implements the optional-member convention)". The conformance suite that exercises
it is tracked separately (#972); this ADR documents the seam it targets.

## Consequences

- ✅ A documented, non-breaking growth path for the `Interactor` contract, with a
  clear order of preference and an explicit note on the one bare first-party
  implementer.
- ✅ Role + verbatim-name selection ships now, ergonomically, with **one** new
  method on `CssLocator` and zero new `Interactor` surface — the CSS/DOM-only
  boundary stays intact.
- ✅ The hard, cross-engine computed-name `findByRole` stays deferred (#923) yet
  becomes safe to add later.
- ⚠️ External authors who `implement Interactor` bare instead of extending
  `DOMInteractor` still take an additive-break risk on a future minor; the
  mitigation is documentation, not a type-level guarantee.

## Alternatives considered

| Alternative                                        | Why not chosen                                                                                                                                                             |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Land a bespoke accessible-name `findByRole` now    | Pulls #923's hard cross-engine accname work forward and breaches the CSS/DOM-only boundary D2 declares; the common verbatim case is fully met by `CssLocator.and()`.       |
| Make every `Interactor` member optional at 1.0     | Weakens the type contract for _all_ consumers to hedge the rare external bare-implementer; the extension path covers the common adapter author, optional members the rest. |
| `bySameElement(...)` free function for composition | Considered; `.and()` reads better at call sites and adds no new barrel export — only one method on an already-frozen class.                                                |
| `byRole(value, { name })` option object            | Bakes `aria-label` into `byRole`, does not generalize to other attributes, and the `name` term invites confusion with the deferred _computed_-name resolution.             |

## Related

- [ADR-002](002-interactor-abstraction.md) — the `Interactor` abstraction and the per-adapter inheritance note this builds on.
- [ADR-006](006-1.0-api-freeze-and-evolution.md) §6 — the constraint this decision's mechanism resolves.
- [ADR-001](../../docs/adr/0001-interactor-primitives-and-name-aware-role.md) — the deferred accessible-name `findByRole` design (Decision B) this keeps deferred (#923).
- Issues #962 (this decision), #923 (computed-name `findByRole`), #972 (conformance suite), #909 (Astryx umbrella).
