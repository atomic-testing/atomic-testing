# Module group: MUI component drivers (v6 / v7)

Drivers for Material-UI core components, one package per MUI major:

| Package                                   | Targets | MUI peer           |
| ----------------------------------------- | ------- | ------------------ |
| `@atomic-testing/component-driver-mui-v6` | MUI v6  | `@mui/material@^6` |
| `@atomic-testing/component-driver-mui-v7` | MUI v7  | `@mui/material@^7` |

> MUI 5 reached end of support on 2026-06-27 (see [ADR-005](../adr/005-drop-mui-5-support.md)); `component-driver-mui-v5`'s source and full history now live in [atomic-testing/component-driver-mui-v5](https://github.com/atomic-testing/component-driver-mui-v5).
>
> The two packages are ~95% identical at the code level — same exports, same APIs. They diverge only where a MUI major changes DOM structure, roles, or class names. See [ADR-003](../adr/003-version-specific-packages.md). This doc uses **v7** as the reference; the catalog and patterns apply to v6 too.

Each mui package depends on `component-driver-html`, `core`, `dom-core`, and a React package (`mui-v7` → `react-18`) plus `@mui/material` and `@emotion/*` ([mui-v7/package.json#L25-L33](../../packages/component-driver-mui-v7/package.json#L25-L33)).

## Public surface (v7)

Barrel: [component-driver-mui-v7/src/index.ts](../../packages/component-driver-mui-v7/src/index.ts).

Drivers: `AccordionDriver`, `AlertDriver`, `AutoCompleteDriver` (+ `defaultAutoCompleteDriverOption`, option types), `BadgeDriver`, `ButtonDriver`, `CheckboxDriver`, `ChipDriver`, `DialogDriver`, `FabDriver`, `InputDriver`, `ListDriver`, `ListItemDriver`, `MenuDriver`, `MenuItemDriver`, `ProgressDriver`, `RatingDriver`, `SelectDriver`, `SliderDriver`, `SnackbarDriver`, `SwitchDriver`, `TextFieldDriver`, `ToggleButtonDriver`, `ToggleButtonGroupDriver`, `ExclusiveToggleButtonGroupDriver`.

Errors: `MenuItemDisabledError`, `MenuItemNotFoundError` (+ `*Id`) ([index.ts#L29-L30](../../packages/component-driver-mui-v7/src/index.ts#L29-L30)).

## Responsibilities

- Map MUI's rendered DOM (roles, `Mui*` classes, portals) to semantic driver APIs, composing HTML drivers for leaf elements.
- Encapsulate MUI quirks (portal rendering, native-vs-custom select, transition timing) so test authors don't.

## Non-goals

- Not a re-implementation of MUI behavior — drivers only _observe and act on_ rendered MUI DOM.
- No cross-version abstraction layer — each major is its own package.

## How it works — three representative drivers

### Portal/list driver — `MenuDriver`

MUI menus render in a portal outside the trigger's DOM. The driver escapes its declared parent via the locator-override hooks ([MenuDriver.ts](../../packages/component-driver-mui-v7/src/components/MenuDriver.ts#L24-L65)):

```ts
override overriddenParentLocator() { return byRole('presentation', 'Root'); }
override overrideLocatorRelativePosition() { return 'Same'; }
```

It iterates `byRole('menuitem')` with `listHelper.getListItemIterator(..., MenuItemDriver)`; `selectByLabel` clicks the match or throws `MenuItemNotFoundError`.

### Container driver — `DialogDriver`

`DialogDriver<ContentT> extends ContainerDriver<ContentT, typeof parts>` with `parts = { title, dialogContainer }` and a generic `content` for the dialog body ([DialogDriver.ts](../../packages/component-driver-mui-v7/src/components/DialogDriver.ts#L29-L97)). It also uses `overriddenParentLocator() → byRole('presentation','Root')`, and adds `getTitle`, `isOpen`, and transition-aware `waitForOpen`/`waitForClose` (built on `interactor.waitUntil`).

### Composite input — `SelectDriver`

Handles both native `<select>` and MUI's custom dropdown via a four-part scene (`trigger`, `dropdown`, `input`, `nativeSelect`) ([SelectDriver.ts](../../packages/component-driver-mui-v7/src/components/SelectDriver.ts#L27-L223)). Notable: `trigger` uses `byRole('combobox')` with an inline comment that MUI changed the role from `button` to `combobox` at 5.12 — **this kind of selector difference is exactly why versions are split**. Methods: `getValue`, `setValue`, `selectByLabel`, `getSelectedLabel`, `openDropdown`/`closeDropdown`, `isNative`, `isDropdownOpen`, `isDisabled`.

## Version differences (v6 → v7)

- **API-identical**: the exported driver set and public methods match across versions.
- **What changes**: CSS class names (`.Mui*`), ARIA roles (the `combobox` example), occasional DOM nesting, and the `driverName` string (`MuiV6*`/`MuiV7*`). [inferred] from sampling identical structure across versions and the role-change comment in `SelectDriver`.
- **Practical rule**: when fixing a driver bug caused by a MUI change, fix it in the affected version package only; if it affects all, replicate across v6/v7.

## Errors

`MenuItemNotFoundError(label, driver)` / `MenuItemDisabledError(label, driver)` extend core `ErrorBase`; thrown by `MenuDriver.selectByLabel` and `SelectDriver.selectByLabel` when an item is missing/disabled ([MenuDriver.ts#L53-L60](../../packages/component-driver-mui-v7/src/components/MenuDriver.ts#L53-L60), [SelectDriver.ts#L142-L146](../../packages/component-driver-mui-v7/src/components/SelectDriver.ts#L142-L146)).

## Extension points — add/port a MUI driver

1. Create `src/components/XDriver.ts` extending `ComponentDriver`/`ContainerDriver`/`ListComponentDriver`.
2. Declare `parts` with `satisfies ScenePart`, composing HTML drivers for leaves.
3. For portal components, override `overriddenParentLocator()`/`overrideLocatorRelativePosition()`.
4. Set `driverName` to `MuiV<N><Name>Driver`; export from the package `index.ts`.
5. Replicate into the other version packages, adjusting selectors/roles per MUI major.

## Related files

- [SelectDriver.ts](../../packages/component-driver-mui-v7/src/components/SelectDriver.ts) — native/custom + role-change example.
- [DialogDriver.ts](../../packages/component-driver-mui-v7/src/components/DialogDriver.ts) — container + transition waiting.
- [modules/component-driver-html.md](component-driver-html.md) — the leaf drivers these compose.
- [adr/003-version-specific-packages.md](../adr/003-version-specific-packages.md) — the version-split decision.
