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
solves the same arbitrary-interior problem for MUI's `action` prop with a call-time
getter and a plain `ComponentDriver` — no `content` channel. `DataGridRowDriverBase.getCell`
and `ListComponentDriver.getItemByIndex` are the same shape, the latter with the
declared-default-plus-call-time-override hybrid. The plumbing (`listHelper`,
`childListHelper`, `getPartFromDefinition`) was already written.

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

**Synchronous.** A `PartLocator` resolves lazily, so `within` queries nothing and
needs no `await`. CDK's `getHarness` is async because it resolves elements; copying
that here would put an `await` and a paren nest at every call site and reverse the
ergonomic gain. A future class-taking overload _would_ be async — it probes
existence, as `getActionComponent` and `getCell` both do.

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
