# @atomic-testing/storybook

Framework-agnostic Storybook integration for atomic-testing component drivers.
Drive your existing drivers inside Storybook `play` functions — in the Storybook
UI and under `@storybook/addon-vitest` — with no React `act()` / Vue `nextTick()`
plumbing and interactions routed through Storybook's instrumented `userEvent`.

## Installation

```bash
pnpm add @atomic-testing/storybook
```

See the [documentation](https://atomic-testing.dev/) for usage examples.

## Public API & stability

The stable surface of this package is its `.` barrel exports, frozen under
SemVer and machine-checked by the committed [API Extractor](https://api-extractor.com/)
report at [`etc/storybook.api.md`](etc/storybook.api.md). Exports tagged `@internal` are
not part of that guarantee. See the [1.0 API freeze & evolution policy](../../agent-docs/adr/006-1.0-api-freeze-and-evolution.md).
