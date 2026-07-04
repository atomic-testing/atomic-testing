# @atomic-testing/component-driver-radix-v1

Component drivers for [Radix UI](https://www.radix-ui.com/primitives) primitives. Component drivers expose simple APIs for unit tests or end-to-end tests to interact with Radix-based components—reading state and driving actions—so test engineers focus on test flows instead of the component internals.

## The problem

Radix primitives are unstyled: consumers style them with whatever they like (most commonly Tailwind utility classes via [shadcn/ui](https://ui.shadcn.com)), so class names are **not stable test anchors**. Radix is ARIA-first and additionally exposes machine-readable state through `data-*` attributes. The stable anchors, in priority order, are:

1. **`role` + accessible name** (Radix renders correct ARIA roles on every part)
2. **`data-slot`** (the shadcn/ui convention naming each part)
3. **Radix state attributes** — `data-state`, `data-orientation`, `data-disabled`, `data-side`, …
4. Never Tailwind/shadcn utility classes.

## The solution

The drivers in this package locate Radix parts by those stable anchors and expose high-level interactions. Combined with a React adapter, the same scene definitions run across DOM (jsdom) and end-to-end (Playwright) tests.

Testing a [shadcn/ui](https://ui.shadcn.com) app? Use [`@atomic-testing/component-driver-shadcn-v1`](https://www.npmjs.com/package/@atomic-testing/component-driver-shadcn-v1) — the same drivers under the name your codebase speaks.

## Target package & version pin

This driver targets the **unified [`radix-ui`](https://www.npmjs.com/package/radix-ui) package** (v1), not the per-primitive `@radix-ui/react-*` packages. It is declared as a **peer dependency pinned to `^1.0.0`**: consumers bring their own Radix. Radix peer-requires **React ≥18**, so test with `@atomic-testing/react-18` or `@atomic-testing/react-19` to match your app.

> Apps that consume per-primitive `@radix-ui/react-*` packages render identical DOM (the unified package re-exports them), so the drivers work there too — only the peer-dependency declaration names the unified package.

## Installation

```bash
npm install @atomic-testing/core @atomic-testing/react-19 \
  @atomic-testing/component-driver-html @atomic-testing/component-driver-radix-v1 \
  radix-ui --save-dev
```

Refer to the [documentation](https://atomic-testing.dev/) for usage patterns and examples.

## Drivers

Wave 0 — foundation. The proof-of-life driver below validates the package, the
test harness (jsdom + Playwright on chromium/firefox/webkit), and the locator
strategy; the primitive waves (buttons/forms, overlays, selection, …) build on it.

| Driver            | Radix primitive  | Notes                                                  |
| ----------------- | ---------------- | ------------------------------------------------------ |
| `SeparatorDriver` | `Separator.Root` | `getOrientation` (`data-orientation`), `isDecorative`. |

Portalled overlays (Dialog, DropdownMenu, Popover, Tooltip, …) follow the MUI
portal re-root recipe — see the
[portals & overlays guide](https://atomic-testing.dev/docs/guides/portal-and-overlays).

For more in-depth information, visit [https://atomic-testing.dev](https://atomic-testing.dev).
