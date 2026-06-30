# @atomic-testing/component-driver-html

Component drivers for standard HTML elements.
Use these drivers to interact with the DOM when writing Atomic Testing scenes.

## Installation

```bash
pnpm add @atomic-testing/component-driver-html
```

For usage examples see the [documentation](https://atomic-testing.dev/).

## Public API & stability

The stable surface of this package is its `.` barrel exports, frozen under
SemVer and machine-checked by the committed [API Extractor](https://api-extractor.com/)
report at [`etc/component-driver-html.api.md`](etc/component-driver-html.api.md). Exports tagged `@internal` are
not part of that guarantee. See the [1.0 API freeze & evolution policy](../../agent-docs/adr/006-1.0-api-freeze-and-evolution.md).

## Capability interfaces

These HTML drivers are the reference implementations of the core capability
interfaces — each interface below is demonstrated by at least one driver, so the
contract is exercised rather than aspirational. `HTMLTextInputDriver` implements
the full form-control set and is the canonical exemplar.

| Capability interface  | Method           | Exemplar driver       |
| --------------------- | ---------------- | --------------------- |
| `IInputDriver<T>`     | `get/setValue`   | `HTMLTextInputDriver` |
| `IClickableDriver`    | `click`          | `HTMLButtonDriver`    |
| `IToggleDriver`       | `is/setSelected` | `HTMLCheckboxDriver`  |
| `IDisableableDriver`  | `isDisabled`     | `HTMLButtonDriver`    |
| `IReadonlyableDriver` | `isReadonly`     | `HTMLTextInputDriver` |
| `IRequirableDriver`   | `isRequired`     | `HTMLTextInputDriver` |
| `IValidatableDriver`  | `isError`        | `HTMLTextInputDriver` |

`IDisableableDriver` is also implemented by `HTMLCheckboxDriver`, `HTMLSelectDriver`
and `HTMLRangeInputDriver`; `IReadonlyableDriver` by those same three input drivers.
