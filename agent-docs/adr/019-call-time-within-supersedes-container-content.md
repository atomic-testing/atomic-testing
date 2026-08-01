# ADR-019: Call-time `within()` supersedes `ContainerDriver`'s declared `content`

## Status

Accepted (2026-07-31). `ComponentDriver.within()` replaces the container mechanism
outright: `ContainerDriver`, `IContainerDriverOption`, and `ContainerPartDefinition`
(with its `ScenePartDefinition` union member) are **removed**, not deprecated.

Removing rather than deprecating is a deliberate use of the pre-1.0 window. ADR-006
§2's deprecate-for-≥1-minor lifecycle binds **once 1.0 ships**; core is at 0.99.0, so
this is the last point where the container vocabulary can leave cheaply. Deprecating
instead would have frozen it into the 1.0 surface and deferred removal to 2.0 —
carrying two ways to express one idea across the entire 1.x line.

## Context

`ContainerDriver` exists so a driver's chrome can be fixed while its interior is
scene-specific (a dialog's body, a popover's panel). But the mechanism it uses is
**a second parts channel that differs from `parts` only in who authors it** — both
are built by the same `getPartFromDefinition` against the same locator. What was
one distinction had grown five encodings: the base class, the `<ContentT, T>` type
parameter pair, `IContainerDriverOption`, `ContainerPartDefinition` plus its
`ScenePartDefinition` union member, and rule 3 of the decomposition guide.

The cost landed on scene authors and driver authors alike:

- **The same scene had to be named twice** — once as the driver's type argument,
  once in `option.content`.
- **33 subclass constructors existed only to launder the option**
  (`content: (option?.content ?? {}) as ContentT`), cast included; the MUI, Radix,
  and Angular Material `DialogDriver` constructors did nothing else.
- **One interior per driver instance.** Reusing a dialog with two different bodies
  in one test needed either a union `ScenePart` or two scene entries.
- **`commutableOption` carried a field its type does not admit.** The runtime
  destructure in `ComponentDriver` strips only `parts`, so a container's `content`
  flowed into every dynamically-created child (latent only because the item drivers
  ignore their option).

In-repo prior art already pointed at the fix. `SnackbarDriver.getActionComponent`
solved the same arbitrary-interior problem for MUI's `action` prop with a call-time
getter and a plain `ComponentDriver` — no `content` channel — and this ADR's own
mechanism then subsumed it, so it is removed here too (see Consequences).
`DataGridRowDriverBase.getCell` and `ListComponentDriver.getItemByIndex` are the same
shape and survive, the latter with the declared-default-plus-call-time-override
hybrid. The plumbing (`listHelper`, `childListHelper`, `getPartFromDefinition`) was
already written.

## Decision

Add **`ComponentDriver.within(parts)`** — synchronous, returns one driver per named
part, resolved against the host's own locator. Delete `ContainerDriver`,
`IContainerDriverOption`, `ContainerPartDefinition`, and the union member, and
re-base every driver that extended the container base onto plain `ComponentDriver`.

Three sub-decisions worth recording:

**Named `within`, not `getContent`.** `getContent` is already owned by eight shipped
leaf drivers — `BadgeDriver` (mui v6/v7/v9), `TooltipDriver` (fluent, radix, reka),
`HoverCardDriver` and `PopoverDriver` (astryx) — all as `(): Promise<string | null>`
for reading a component's own text. A base-class member cannot collide with them;
`tsc` rejected it outright.

`within` is collision-free and is **the** established word for this operation in the
libraries our audience already uses: Testing Library's `within(container)` narrows
queries to a subtree, which is exactly what this does. A test author reads it without
being taught. Two rejected alternatives are worth recording: `scope` (shipped briefly
on this branch) is borrowed vocabulary that names the mechanism rather than the intent
— it does not say what it returns; and `getParts` reads clearly but fights a stronger
convention, since every `get*` in this repo that returns a driver is `async` and
returns `Promise<X | null>`, while sync values are exposed as properties (`parts`,
`locator`, `commutableOption`). `within` carries neither problem.

**Takes a `ScenePart`, not a driver class.** The class-taking form has more in-repo
precedent, but it needs the driver class to carry its own locator — what Angular CDK
gets from `static hostSelector` and Frontside Interactors from `TextField.byId(…)`.
This repo deliberately splits locator (ScenePart) from driver class. Every real
interior here is a bag of siblings (`{cancel, confirm}`, `{nameInput, saveButton}`),
so the ScenePart form covers every existing site and the class form covers none
without a wrapper driver per interior.

**The anchor is the driver's, not the locator's.** `within` resolves against
`ComponentDriver.interiorLocator` — a `protected` getter defaulting to the driver's
own `locator` — rather than against `locator` directly. The default is correct
wherever a driver's locator already resolves to the surface holding caller content
(Radix/Reka anchor at `Dialog.Content`, Fluent at `DialogSurface`, Angular Material
at `<mat-dialog-container>`), which is most of them — see **Rollout width** below for
what "correct enough" means in each case.

It is wrong for MUI. `DialogDriver` and `DrawerDriver` anchor at the portal-rendered
**Modal root**, whose direct children are `.MuiBackdrop-root`, two focus-trap
sentinels and a positioning container; the caller's content is a further two levels
in, inside `.MuiDialog-paper` (`role="dialog"`). Verified against rendered DOM on
v6, v7 and v9 — identical in all three. Un-narrowed, `within` reached MUI's own
backdrop and sentinels, and a `'Child'`-relative interior part resolved to
`.MuiBackdrop-root` rather than to anything the scene wrote. Nothing raised: a
locator that matches the wrong element is indistinguishable from one that matches
the right one.

That made the same scene line mean different things per design system, which defeats
the portability the library exists for. Anchoring is the driver's job — knowing that
MUI wraps its paper in a Modal root is exactly the kind of DOM knowledge a driver
exists to absorb, and doing it here keeps scene code unchanged.

The binding rule for an override: **it must contain everything the caller supplied.**
For a slotted component that means the surface, never one slot. MUI spreads caller
content across `DialogTitle`/`DialogContent`/`DialogActions` as siblings, so
narrowing to `.MuiDialogContent-root` would drop the action buttons scenes actually
click. Over-narrowing fails the same silent way it fixes.

Two alternatives were rejected. **Per-slot proxy methods** (`withinActions`,
`withinBody`) are more explicit, but design systems disagree on slot names
(`DialogContent` vs `DialogBody` vs `mat-dialog-content`), so scenes stop being
portable — and it rebuilds the per-driver vocabulary sprawl this ADR just deleted.
**Chaining through a chrome part** (`dialog.parts.paper.within(…)`) needs no new API
and works today, but it pushes package-specific structure into scene code and
promotes chrome parts into navigation API. It stays available for deliberate
slot-level targeting; it is just not the default.

**Rollout width — audited, not assumed.** Every shipped driver a scene can call
`within` on was probed against rendered DOM before deciding whether it needed an
override. Only MUI's Modal family does: `Dialog`, `Drawer`, and — found by that same
probe — `Menu`, which is a `Popover` on a `Modal` and so carries the identical
backdrop-and-sentinels root. Its override anchors on the `role="menu"` list its own
`menu` chrome part already names, mirroring Dialog's use of `paper`.

Three candidate narrowings were rejected on the evidence:

- **MUI `Snackbar`** — its root's only child _is_ the caller's content, and narrowing
  to `SnackbarContent` would break the `Snackbar`-wrapping-an-`Alert` form, where no
  `SnackbarContent` is rendered at all. The default resolves correctly already, and
  the `actionArea` chrome part reaches the `action` prop's interior.
- **Fluent `DialogSurface` / `OverlayDrawer` / `TeachingPopoverSurface`** — each wraps
  caller content in tabster focus-trap sentinels that are _siblings_ of that content
  rather than ancestors of it. Chrome does therefore leak into a `'Child'`-relative
  interior, but no element holds the caller's content and nothing else: narrowing to
  `DialogBody` would over-narrow, Fluent treating it as optional.
- **Angular Material `MatDialog`** — its container wraps caller content in a single
  surface div, so the only narrowing available is a `.mat-mdc-*` class, which the
  package's own overlay-locator rule reserves for `.cdk-*` alone. `MatMenu` needs
  nothing: its locator already _is_ the `role="menu"` panel.

Radix and PrimeVue anchor on the caller's content surface directly and probed clean.
The rule that falls out: override only where the driver's locator element holds chrome
**ancestral to** the caller's content. Where chrome is merely adjacent to it, no anchor
separates the two and the default is the honest answer.

**Synchronous.** A `PartLocator` resolves lazily, so `within` queries nothing and
needs no `await`. CDK's `getHarness` is async because it resolves elements; copying
that here would put an `await` and a paren nest at every call site and reverse the
ergonomic gain. A future class-taking overload _would_ be async — it probes
existence, as `getCell` does.

## Consequences

- ✅ Scene authors name an interior once, at the point of use;
  `driver: DialogDriver` needs no type argument and no `option`.
- ✅ One host instance serves any number of interiors.
- ✅ Available on every driver, including those that never extended `ContainerDriver`.
- ✅ **One mechanism, one vocabulary.** The base class, the `<ContentT, T>` pair, the
  option interface, the part-definition variant, and the union member are all gone;
  the 33 laundering constructors collapse to ordinary `parts`-hardcoding ones.
- ⚠️ **Breaking.** `etc/core.api.md` loses three exports, and every shipped driver
  that was a container loses its `ContentT` type parameter and its `content` getter.
  An external scene written as `DialogDriver<typeof body>` + `option: { content: body }`
  becomes `DialogDriver` + `dialog.within(body)`. Taken knowingly while pre-1.0 (see
  Status).
- ℹ️ `skillClaims.mjs`'s `CANONICAL_CORE_SYMBOLS` drops `ContainerDriver` and gains
  `within`. That list asserts a two-way bond — SKILL-SYNC-01 fails if a listed symbol
  leaves core, SKILL-SYNC-02 fails if no distributed skill names it — so the entry
  had to leave with the class.
- ⚠️ **The scene file is no longer the complete map** of what a test can reach —
  part of the tree now lives at call sites. Mitigated by convention: keep interior
  `ScenePart` consts in the scene file, where every migrated one already lives.
- ⚠️ The interior is named at each use rather than once. For a composite driver,
  hoist it into one accessor rather than repeating the const per method.
- ⚠️ **`SnackbarDriver.getActionComponent` (mui v6/v7/v9) is removed.** It reached an
  interior one locator + one driver class at a time, async and nullable — a second,
  narrower way to express what `within` now covers, and called by no suite in the
  repo. `snackbar.parts.actionArea.within(parts)` replaces it with no new code and
  handles the multi-part action areas the old signature could not.
- ⚠️ **`within` no longer literally means "under this driver's locator."** The
  indirection is deliberate — "inside this component, as the driver defines inside" —
  but a driver author who over-narrows `interiorLocator` breaks every scene using
  that driver, silently. Any override needs a DOM audit and a regression test
  anchored on something relative (`'Child'`), which is what actually detects it.
- ⚠️ **`examples/*` lag by one release.** Each example app is a standalone workspace
  pinning `@atomic-testing/*` at released npm versions (not `workspace:*`), so it
  typechecks against the _published_ `core`, where `within` does not exist yet.
  `example-shadcn-workspace` therefore still uses `content` and keeps compiling
  against its `^0.99.0` pin; migrate it in the same change that bumps that pin past
  this release. `package-tests/*` are workspace-linked and had no such wait.
- ℹ️ Only containers' `commutableOption` leak is closed. The general mismatch
  (`ListComponentDriver` leaks `itemClass`/`itemLocator` the same way) is untouched
  and needs its own change to `listHelper`, `childListHelper`, and
  `ListComponentDriver`.

## Alternatives considered

| Alternative                                  | Why not chosen                                                                                                                                                                                                                |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getContent(parts)`                          | Name occupied by 8 shipped leaf drivers with an incompatible signature; rejected by `tsc`.                                                                                                                                    |
| `within(locator, driverClass)` only          | More in-repo precedent, but covers none of the 24 real sites without a wrapper driver per interior.                                                                                                                           |
| Ship both forms now                          | One arm would have zero callers; the overload can be added when a single-interior case appears.                                                                                                                               |
| Keep `ContainerDriver`, slim it down         | Retains the class, option field, and union member, so the dual vocabulary and boilerplate constructors survive — most of the gain forfeited.                                                                                  |
| Deprecate now, remove in 2.0                 | Freezes the container vocabulary into the 1.0 surface and carries two ways to say one thing across all of 1.x. ADR-006 §2's lifecycle binds only once 1.0 ships, so pre-1.0 removal costs a runway nobody is standing on yet. |
| Pass `commutableOption` to interior children | Would change behavior for the migrated scenes; `content` children have always received `{}`. Preserved deliberately, and documented on `within`.                                                                              |

## Related

- [ADR-006](006-1.0-api-freeze-and-evolution.md) §2 — the deprecate-before-remove rule this follows.
- [ADR-017](017-part-locator-chain-reshape.md) — the open 2.0 window that carries the removal.
- `packages/core/src/drivers/ComponentDriver.ts` — `within` and its TSDoc.
- `packages/core/src/drivers/__tests__/ComponentDriver.test.ts` — locks equivalence
  with the deprecated `content` channel, the option asymmetry, and multi-interior use.
