# ADR-019: Call-time `scope()` supersedes `ContainerDriver`'s declared `content`

## Status

Accepted (2026-07-30). Additive: `ComponentDriver.scope()` ships now,
`ContainerDriver` and its three companion types are deprecated in place, and removal
is scheduled for the 2.0 window tracked by [ADR-017](017-part-locator-chain-reshape.md).

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

Add **`ComponentDriver.scope(parts)`** — synchronous, returns one driver per named
part, resolved against the host's own locator. Deprecate `ContainerDriver`,
`IContainerDriverOption`, `ContainerPartDefinition`, and the union member.

Three sub-decisions worth recording:

**Named `scope`, not `getContent`.** `getContent` is already owned by eight shipped
leaf drivers — `BadgeDriver` (mui v6/v7/v9), `TooltipDriver` (fluent, radix, reka),
`HoverCardDriver` and `PopoverDriver` (astryx) — all as `(): Promise<string | null>`
for reading a component's own text. A base-class member cannot collide with them;
`tsc` rejected it outright. `scope` is collision-free and matches the vocabulary the
external prior art converged on (Testing Library's `within`, Playwright's
`locator.locator`).

**Takes a `ScenePart`, not a driver class.** The class-taking form has more in-repo
precedent, but it needs the driver class to carry its own locator — what Angular CDK
gets from `static hostSelector` and Frontside Interactors from `TextField.byId(…)`.
This repo deliberately splits locator (ScenePart) from driver class. Every real
interior here is a bag of siblings (`{cancel, confirm}`, `{nameInput, saveButton}`),
so the ScenePart form covers all 24 existing sites and the class form covers none
without a wrapper driver per interior.

**Synchronous.** A `PartLocator` resolves lazily, so `scope` queries nothing and
needs no `await`. CDK's `getHarness` is async because it resolves elements; copying
that here would put an `await` and a paren nest at every call site and reverse the
ergonomic gain. A future class-taking overload _would_ be async — it probes
existence, as `getActionComponent` and `getCell` both do.

## Consequences

- ✅ Scene authors name an interior once, at the point of use;
  `driver: DialogDriver` needs no type argument and no `option`.
- ✅ One host instance serves any number of interiors.
- ✅ Available on every driver, including those that never extended `ContainerDriver`.
- ✅ Fully additive — `scope` added, three symbols marked `@deprecated`, nothing
  removed from `etc/core.api.md`. Satisfies ADR-006 §2's deprecate-for-≥1-minor rule,
  and `skillClaims.mjs`'s `ContainerDriver` export claim still holds.
- ⚠️ **The scene file is no longer the complete map** of what a test can reach —
  part of the tree now lives at call sites. Mitigated by convention: keep interior
  `ScenePart` consts in the scene file, where all 24 migrated ones already live.
- ⚠️ The interior is named at each use rather than once. For a composite driver,
  hoist it into one accessor — see `DangerZoneDriver.confirmButtons` in
  `examples/example-shadcn-workspace`.
- ⚠️ The 33 laundering constructors survive until the 2.0 removal; this ADR retires
  the `content` _channel_ in-repo, not yet the classes that offer it. Shipped driver
  classes keep their `ContentT` parameter (now defaulted to `{}`) so external scenes
  still compile.
- ℹ️ Only containers' `commutableOption` leak is closed. The general mismatch
  (`ListComponentDriver` leaks `itemClass`/`itemLocator` the same way) is untouched
  and needs its own change to `listHelper`, `childListHelper`, and
  `ListComponentDriver`.

## Alternatives considered

| Alternative                                  | Why not chosen                                                                                                                                     |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getContent(parts)`                          | Name occupied by 8 shipped leaf drivers with an incompatible signature; rejected by `tsc`.                                                         |
| `scope(locator, driverClass)` only           | More in-repo precedent, but covers none of the 24 real sites without a wrapper driver per interior.                                                |
| Ship both forms now                          | One arm would have zero callers; the overload can be added when a single-interior case appears.                                                    |
| Keep `ContainerDriver`, slim it down         | Retains the class, option field, and union member, so the dual vocabulary and boilerplate constructors survive — most of the gain forfeited.       |
| Remove the container types now               | Breaks external scenes with no runway and violates ADR-006 §2.                                                                                     |
| Pass `commutableOption` to interior children | Would change behavior for the 24 migrated scenes; `content` children have always received `{}`. Preserved deliberately, and documented on `scope`. |

## Related

- [ADR-006](006-1.0-api-freeze-and-evolution.md) §2 — the deprecate-before-remove rule this follows.
- [ADR-017](017-part-locator-chain-reshape.md) — the open 2.0 window that carries the removal.
- `packages/core/src/drivers/ComponentDriver.ts` — `scope` and its TSDoc.
- `packages/core/src/drivers/__tests__/ComponentDriver.test.ts` — locks equivalence
  with the deprecated `content` channel, the option asymmetry, and multi-interior use.
