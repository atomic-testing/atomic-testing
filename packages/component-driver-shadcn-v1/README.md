# @atomic-testing/component-driver-shadcn-v1

Component drivers for [shadcn/ui](https://ui.shadcn.com) apps. Component drivers expose simple APIs for unit tests or end-to-end tests to interact with your components—reading state and driving actions—so test engineers focus on test flows instead of the component internals.

## Why a shadcn package?

shadcn/ui components are **styled Radix UI primitives**: `npx shadcn add dialog` copies a thin Tailwind-styled wrapper around `Dialog` from `radix-ui` into your codebase. At test time the DOM your app renders _is_ Radix DOM — the wrapper adds classes (never stable anchors) and `data-slot` attributes (excellent anchors).

This package is therefore a **pure re-export of [`@atomic-testing/component-driver-radix-v1`](https://www.npmjs.com/package/@atomic-testing/component-driver-radix-v1)** under the name your codebase speaks. Same classes, same behavior, one implementation:

- `instanceof` agrees across both package names — a driver imported from either package is the _same class_.
- Versioning tracks `component-driver-radix-v1`'s major in lockstep.

## What the drivers anchor on

Never Tailwind utility classes — they change with every restyle. In priority order:

1. **`role` + accessible name** (Radix renders correct ARIA on every part)
2. **`data-slot`** — the shadcn/ui convention naming each part (`data-slot="dialog-content"`, …)
3. **Radix state attributes** — `data-state`, `data-orientation`, `data-disabled`, …

## Installation

```bash
npm install @atomic-testing/core @atomic-testing/react-19 \
  @atomic-testing/component-driver-html @atomic-testing/component-driver-shadcn-v1 \
  --save-dev
```

## Usage

```ts
import { SeparatorDriver } from '@atomic-testing/component-driver-shadcn-v1';
import { byDataTestId, ScenePart } from '@atomic-testing/core';

const parts = {
  divider: { locator: byDataTestId('divider'), driver: SeparatorDriver },
} satisfies ScenePart;
```

Refer to the [documentation](https://atomic-testing.dev/) for usage patterns and examples, and to the [`component-driver-radix-v1` README](https://www.npmjs.com/package/@atomic-testing/component-driver-radix-v1) for the driver catalog.
