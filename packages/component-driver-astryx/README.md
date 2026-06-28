# @atomic-testing/component-driver-astryx

Component drivers for [Astryx](https://github.com/facebook/astryx), Meta's open-source, StyleX-based design system. Component drivers expose simple APIs for unit tests or end-to-end tests to interact with Astryx components—reading state and driving actions—so test engineers focus on test flows instead of the component internals.

## The problem

Astryx styles components with [StyleX](https://stylexjs.com), whose class names are build-time hashed and therefore are **not stable test anchors**. Astryx is ARIA-role-first: widgets expose a semantic `role` plus an accessible name (visible text or `aria-label`). The stable anchors are **`data-testid`, `role`, and accessible name—never StyleX classes**.

## The solution

The drivers in this package locate Astryx components by those stable anchors and expose high-level interactions. Combined with a React adapter, the same scene definitions run across DOM (jsdom) and end-to-end (Playwright) tests.

## Target package & version pin

This driver targets the published Astryx package **[`@astryxdesign/core`](https://www.npmjs.com/package/@astryxdesign/core)** (the components live here; theme packages such as `@astryxdesign/theme-neutral` are separate). It is declared as a **peer dependency pinned to `^0.1.1`**: consumers bring their own Astryx, and the caret on a `0.x` release locks the `0.1` minor (`>=0.1.1 <0.2.0`)—the closest analogue to "pin a major" while Astryx is pre-1.0. Astryx peer-requires **React ≥19**.

> Astryx forks (`-vN`) are deferred: a single package tracks one `0.x` minor until a breaking Astryx release warrants a versioned fork.

## Installation

```bash
npm install @atomic-testing/core @atomic-testing/react-19 \
  @atomic-testing/component-driver-html @atomic-testing/component-driver-astryx \
  @astryxdesign/core --save-dev
```

Refer to the [documentation](https://atomic-testing.dev/) for usage patterns and examples.

## Drivers

| Driver         | Astryx component | Notes                                                                                                            |
| -------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| `ButtonDriver` | `Button`         | `getLabel` (verbatim `aria-label` or visible text), `isDisabled` (native or `aria-disabled`), inherited `click`. |

For more in-depth information, visit [https://atomic-testing.dev](https://atomic-testing.dev).
