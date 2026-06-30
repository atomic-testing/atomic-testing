# @atomic-testing/component-driver-html

Component drivers for standard HTML elements.
Use these drivers to interact with the DOM when writing Atomic Testing scenes.

## Installation

```bash
pnpm add @atomic-testing/component-driver-html
```

For usage examples see the [documentation](https://atomic-testing.dev/).

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
