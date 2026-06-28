# ADR-001: Component-driver pattern with declarative scene parts

## Status

Accepted (describes the existing design; reconstructed from code).

## Context

UI tests that query the DOM directly (raw selectors, `getByTestId` scattered through test bodies) are brittle and duplicate selector knowledge across every test. Selector churn forces edits in many places, and tests read in DOM terms rather than domain terms.

## Decision

Model each component as a **driver** exposing a semantic API, and declare a component's structure as a **`ScenePart`** map of named child parts. A driver:

- extends `ComponentDriver<T>` (or `ContainerDriver`/`ListComponentDriver`) ([ComponentDriver.ts](../../packages/core/src/drivers/ComponentDriver.ts#L25)),
- declares `parts` via `{ locator, driver }` entries (`satisfies ScenePart`) ([partTypes.ts](../../packages/core/src/partTypes.ts#L111-L123)),
- exposes intent-level methods (`getValue`, `selectByLabel`, `isOpen`, …),
- and implements `driverName` for diagnostics.

The driver tree is built eagerly from the scene parts at construction (`getPartFromDefinition`) so `engine.parts.x.parts.y` is fully typed and ready ([driverUtil.ts](../../packages/core/src/drivers/driverUtil.ts#L7-L48)).

## Consequences

- ✅ Tests read in domain terms; selectors live in one driver, not in every test.
- ✅ Composability: complex drivers (MUI `SelectDriver`) reuse leaf drivers (`HTMLButtonDriver`, `HTMLTextInputDriver`).
- ✅ Strong typing end-to-end via `ScenePartDriver<T>` mapped types.
- ⚠️ Some `any` is unavoidable in driver-class generics for variance ([partTypes.ts#L11-L39](../../packages/core/src/partTypes.ts#L11-L39)).
- ⚠️ The part tree is eager — every declared part is instantiated even if a test never touches it (cheap: construction does no DOM work, only locator chaining).

## Alternatives considered

| Alternative                                | Why not chosen                                                                      |
| ------------------------------------------ | ----------------------------------------------------------------------------------- |
| Raw queries / Testing-Library calls inline | Selector duplication, DOM-level test reading, brittle to markup change              |
| Page Object Model (hand-rolled per app)    | No shared abstraction or typing; reinvented per project; no cross-environment reuse |
| Snapshot testing                           | Doesn't express interaction/intent; noisy diffs                                     |

## Related

- [DOMAIN.md → Type system](../DOMAIN.md#type-system), [modules/core.md](../modules/core.md), [modules/component-driver-html.md](../modules/component-driver-html.md).
- Enables [ADR-002](002-interactor-abstraction.md) (the driver delegates to a swappable interactor).
