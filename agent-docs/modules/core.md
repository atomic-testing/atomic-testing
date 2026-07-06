# Module: core (`@atomic-testing/core`)

## Purpose

The framework-agnostic foundation: all types, base driver classes, the `Interactor` interface, the locator system, errors, and utilities. Every other package depends on it; it depends on nothing internal.

## Public surface

Barrel: [core/src/index.ts](../../packages/core/src/index.ts). Highlights:

| Export                                                                                                                                  | Kind                    | File                                                                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `TestEngine`                                                                                                                            | class                   | [TestEngine.ts](../../packages/core/src/TestEngine.ts#L12)                                                                             |
| `ComponentDriver`, `ContainerDriver`, `ListComponentDriver`                                                                             | classes                 | [drivers/index.ts](../../packages/core/src/drivers/index.ts)                                                                           |
| `IInputDriver`, `IFormFieldDriver`, `IToggleDriver`, `IClickableDriver`, `IMouseInteractableDriver`                                     | interfaces              | [driverTypes.ts](../../packages/core/src/drivers/driverTypes.ts)                                                                       |
| `Interactor`                                                                                                                            | interface               | [interactor/Interactor.ts](../../packages/core/src/interactor/Interactor.ts#L26)                                                       |
| `ScenePart`, `ScenePartDefinition`, `ScenePartDriver`, `IComponentDriverOption`, `IContainerDriverOption`, `ComponentDriverCtor`        | types                   | [partTypes.ts](../../packages/core/src/partTypes.ts)                                                                                   |
| `by*` locator builders, `CssLocator`, `LinkedCssLocator`, `PartLocator`                                                                 | functions/types         | [locators/index.ts](../../packages/core/src/locators/index.ts)                                                                         |
| `WaitForOption`, `WaitForCondition`, `defaultWaitForOption`, `WaitUntilOption`                                                          | types/const             | [WaitForOption.ts](../../packages/core/src/drivers/WaitForOption.ts), [timingUtil.ts](../../packages/core/src/utils/timingUtil.ts#L14) |
| errors: `ElementNotFoundError`, `WaitForFailureError`, `MissingPartError`, `TooManyMatchingElementError`, `ItemNotFoundError` (+ `*Id`) | classes                 | [errors/index.ts](../../packages/core/src/errors/index.ts)                                                                             |
| `BoundingRect`, `Point`                                                                                                                 | types                   | [geometry/index.ts](../../packages/core/src/geometry/index.ts)                                                                         |
| `collectionUtil`, `dateUtil`, `escapeUtil`, `locatorUtil`, `timingUtil`, `interactorUtil`                                               | namespaces              | [index.ts#L17-L30](../../packages/core/src/index.ts#L17-L30)                                                                           |
| `Nullable`, `Optional`                                                                                                                  | type helpers            | [dataTypes.ts](../../packages/core/src/dataTypes.ts)                                                                                   |
| `IExampleUIUnit`, `IExampleUnit`                                                                                                        | types (example harness) | [example/types.ts](../../packages/core/src/example/types.ts)                                                                           |

> Utilities are exported as **namespaces** (`export * as locatorUtil`), so call them as `locatorUtil.append(...)`, `timingUtil.waitUntil(...)`, etc.

## Responsibilities

- Define the type contracts (`ScenePart`, driver options, `Interactor`) that bind the whole system. See [DOMAIN.md](../DOMAIN.md#type-system).
- Provide the `ComponentDriver` base + `Container`/`List` specializations and the `TestEngine` root.
- Provide the locator builders and the `locatorUtil` resolution logic that turns a `PartLocator` into a runtime CSS selector.
- Define the error hierarchy and timing/wait primitives.

## Non-goals

- No environment implementation — `Interactor` is only an interface here (implemented in `dom-core`, `playwright`).
- No component-specific drivers — those live in `component-driver-*`.
- No rendering — `createTestEngine` factories live in the adapter packages.

## How it works

`ComponentDriver` holds a `locator`, an `interactor`, and an eagerly-built `parts` tree (via `getPartFromDefinition`). Its public methods (`click`, `getText`, `exists`, `isVisible`, `hover`, `enterText`, `waitUntilComponentState`, `waitUntilVisible`, `runtimeCssSelector`, …) are thin delegations to `this.interactor.<method>(this.locator, …)` ([ComponentDriver.ts](../../packages/core/src/drivers/ComponentDriver.ts#L138-L251)). Subclasses add component-specific semantics and implement the abstract `driverName` getter.

## Key types

See [DOMAIN.md → Type system](../DOMAIN.md#type-system) for the full picture. The driver class hierarchy:

- `ComponentDriver<T extends ScenePart>` — base ([ComponentDriver.ts#L25](../../packages/core/src/drivers/ComponentDriver.ts#L25)).
- `ContainerDriver<ContentT, T>` — adds `content` ([ContainerDriver.ts#L13](../../packages/core/src/drivers/ContainerDriver.ts#L13)).
- `ListComponentDriver<ItemT>` — adds `getItemByIndex/getItemByLabel/getItems/getItemCount` ([ListComponentDriver.ts#L16](../../packages/core/src/drivers/ListComponentDriver.ts#L16)).
- `TestEngine<T>` — adds `cleanUp()` ([TestEngine.ts#L12](../../packages/core/src/TestEngine.ts#L12)).

### Interactor interface surface

The contract every environment implements ([Interactor.ts](../../packages/core/src/interactor/Interactor.ts#L26-L153)):

- **Mutative**: `click`, `mouseMove/Down/Up/Over/Out/Enter/Leave`, `focus`, `blur`, `enterText`, `selectOptionValue`, `hover`, `pressKey` (modifier chords), `activate`, `contextMenu`, `setInputFiles`, `scrollIntoView`, `scrollBy`, `dragTo`, `drag` (pointer-based; not HTML5 DnD — #922), `wait`, `waitUntilComponentState`, `waitUntil<T>`.
- **Read-only**: `getInputValue`, `getSelectValues`, `getSelectLabels`, `getAttribute` (3 overloads incl. `isMultiple`), `getStyleValue`, `getText`, `getBoundingRect`, `exists`, `isChecked`, `isDisabled`, `isReadonly`, `isVisible`, `hasCssClass`, `hasAttribute`.
- **Debug**: `innerHTML`, `clone()`.

## Locators

Builders in [locators/](../../packages/core/src/locators/index.ts), each returning a `CssLocator` (and accepting an optional `relative` position):

| Builder                         | Selects                               | File                                                                          |
| ------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------- |
| `byDataTestId(id)`              | `[data-testid="id"]`                  | [byDataTestId.ts](../../packages/core/src/locators/byDataTestId.ts)           |
| `byAttribute(name, value)`      | `[name="value"]` (special-cases `id`) | [byAttribute.ts](../../packages/core/src/locators/byAttribute.ts)             |
| `byRole(role)`                  | `[role="role"]`                       | [byRole.ts](../../packages/core/src/locators/byRole.ts)                       |
| `byAriaLabel(name)`             | `[aria-label="name"]`                 | [byAriaLabel.ts](../../packages/core/src/locators/byAriaLabel.ts)             |
| `byCssClass(...names)`          | `.a.b`                                | [byCssClass.ts](../../packages/core/src/locators/byCssClass.ts)               |
| `byTagName(tag)`                | `tag`                                 | [byTagName.ts](../../packages/core/src/locators/byTagName.ts)                 |
| `byName(name)`                  | `[name="name"]`                       | [byName.ts](../../packages/core/src/locators/byName.ts)                       |
| `byValue(value)`                | `[value="value"]`                     | [byValue.ts](../../packages/core/src/locators/byValue.ts)                     |
| `byInputType(type)`             | `input[type="type"]`                  | [byInputType.ts](../../packages/core/src/locators/byInputType.ts)             |
| `byChecked(state?)`             | `:checked` / `:not(:checked)`         | [byChecked.ts](../../packages/core/src/locators/byChecked.ts)                 |
| `byCssSelector(sel, relative?)` | raw CSS (escape hatch)                | [byCssSelector.ts](../../packages/core/src/locators/byCssSelector.ts)         |
| `byLinkedElement()`             | fluent → `LinkedCssLocator`           | [byLinkedElement.ts](../../packages/core/src/locators/byLinkedElement.ts#L19) |

Composition lives in `locatorUtil` ([utils/locatorUtil.ts](../../packages/core/src/utils/locatorUtil.ts)): `append(...locators)` chains while respecting `Root` boundaries; `toCssSelector(locator, interactor)` resolves to a runtime selector (awaiting linked-locator resolution); `overrideLocatorRelativePosition(...)` rewrites a locator's relative position. Disambiguate two same-role elements by accessible name with the same-element compound `byRole(role).and(byAriaLabel(name))` ([CssLocator.and](../../packages/core/src/locators/CssLocator.ts) — supersedes the older `append(byRole(role), byAriaLabel(name, 'Same'))`); computed accessible names (not CSS-expressible) await the deferred name-aware `findByRole` (see #923).

## Utilities

| Namespace        | Notable members                                                                                                                            | File                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `timingUtil`     | `wait(ms)`, `waitUntil(option)` (probe loop; even cadence `timeoutMs/probeCount` default 10, or escalating `probeIntervals` when provided) | [timingUtil.ts](../../packages/core/src/utils/timingUtil.ts)         |
| `interactorUtil` | `interactorWaitUtil(locator, interactor, option)` → throws `WaitForFailureError`                                                           | [interactorUtil.ts](../../packages/core/src/utils/interactorUtil.ts) |
| `locatorUtil`    | `append`, `toCssSelector`, `overrideLocatorRelativePosition`, chain helpers                                                                | [locatorUtil.ts](../../packages/core/src/utils/locatorUtil.ts)       |
| `escapeUtil`     | `escapeValue` (CSS escape, LRU-cached), `escapeCssClassName`, `escapeName`                                                                 | [escapeUtil.ts](../../packages/core/src/utils/escapeUtil.ts)         |
| `dateUtil`       | `isHtmlDateInputType`, `validateHtmlDateInput`, `isHtmlInput{Date,Time,DateTime}Format`, `htmlInputDateTypes`                              | [dateUtil.ts](../../packages/core/src/utils/dateUtil.ts)             |
| `collectionUtil` | `toArray`, `getDifference`                                                                                                                 | [collectionUtil.ts](../../packages/core/src/utils/collectionUtil.ts) |
| `listHelper`     | `getListItemByIndex`, `getListItemIterator`, `getListItemCount` (exported via `drivers`)                                                   | [listHelper.ts](../../packages/core/src/drivers/listHelper.ts)       |

## Invariants & failure modes

See [DOMAIN.md → Invariants](../DOMAIN.md#invariants) and [Failure modes](../DOMAIN.md#failure-modes-error-catalog). Core-specific: locator-override hooks run on the prototype before construction, so they cannot use instance state ([driverUtil.ts#L26-L30](../../packages/core/src/drivers/driverUtil.ts#L26-L30)).

## Extension points

- **New locator builder** → add `byX.ts` in `locators/`, export from `locators/index.ts`. Return a `CssLocator` (use `byCssSelector` internally).
- **New base driver capability** → extend `ComponentDriver` or add a capability interface in `driverTypes.ts`.
- **New error** → add under `errors/`, extend `ErrorBase` (driver-scoped) or `InteractorErrorBase` (locator-scoped), export with an id constant.

## Related files

- [TestEngine.ts](../../packages/core/src/TestEngine.ts) — root driver.
- [drivers/driverUtil.ts](../../packages/core/src/drivers/driverUtil.ts) — part-tree builder.
- [drivers/listHelper.ts](../../packages/core/src/drivers/listHelper.ts) — `:nth-of-type` iteration.
- [partTypes.ts](../../packages/core/src/partTypes.ts) — the type system.
