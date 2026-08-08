---
title: Examples and starter fixtures
sidebar_position: 5
---

# Examples and starter fixtures

The scaffolder writes a minimal, passing example so you have something green on
day one — see [Quick Start](../quick-start.mdx). When you outgrow that and want a
worked reference for a specific design system, the monorepo's own
[`package-tests/`](https://github.com/atomic-testing/atomic-testing/tree/main/package-tests)
fixtures are the source to copy from. Each is a real, CI-green project: a rendered
example component, its `ScenePart`, and the same suite driven under both a DOM
runner and a browser. Lift the `ScenePart` and test logic straight out of one.

Note the distinction: these are per-component **fixtures** — each proves and
demonstrates one driver package against one rendered example. The repo's
realistic example **apps** (two workspace apps — Astryx and shadcn/ui — a
ticket console, and a multi-step signup form) are a different resource: whole
pages decomposed into composed
driver trees, closer to what your own suite will look like. For those, see
[Example apps](../evaluate/example-apps.mdx).

## One reference fixture per stack

| Design system             | Framework    | Runner(s)                           | Reference fixture                                                                                                                                                   |
| ------------------------- | ------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTML (framework-agnostic) | React 19     | Jest (DOM) + Playwright (E2E)       | [`component-driver-html-test`](https://github.com/atomic-testing/atomic-testing/tree/main/package-tests/component-driver-html-test)                                 |
| Material UI               | React 19     | Jest (DOM) + Playwright (E2E)       | [`component-driver-mui-v9-test`](https://github.com/atomic-testing/atomic-testing/tree/main/package-tests/component-driver-mui-v9-test)                             |
| MUI X                     | React 19     | Jest (DOM) + Playwright (E2E)       | [`component-driver-mui-x-v9-test`](https://github.com/atomic-testing/atomic-testing/tree/main/package-tests/component-driver-mui-x-v9-test)                         |
| Radix / shadcn            | React 19     | Jest (DOM) + Playwright (E2E)       | [`component-driver-radix-test`](https://github.com/atomic-testing/atomic-testing/tree/main/package-tests/component-driver-radix-test)                               |
| Astryx                    | React 19     | Jest (DOM) + Playwright (E2E)       | [`component-driver-astryx-test`](https://github.com/atomic-testing/atomic-testing/tree/main/package-tests/component-driver-astryx-test)                             |
| Fluent UI v9              | React 19     | Jest (DOM) + Playwright (E2E)       | [`component-driver-fluent-v9-test`](https://github.com/atomic-testing/atomic-testing/tree/main/package-tests/component-driver-fluent-v9-test)                       |
| HTML                      | Vue 3        | Jest (DOM)                          | [`vue-3-test`](https://github.com/atomic-testing/atomic-testing/tree/main/package-tests/vue-3-test)                                                                 |
| PrimeVue                  | Vue 3        | Jest (DOM) + Playwright (E2E)       | [`component-driver-primevue-test`](https://github.com/atomic-testing/atomic-testing/tree/main/package-tests/component-driver-primevue-test)                         |
| Angular Material          | Angular 22   | Vitest (browser) + Playwright (E2E) | [`component-driver-angular-material-v22-test`](https://github.com/atomic-testing/atomic-testing/tree/main/package-tests/component-driver-angular-material-v22-test) |
| HTML                      | Angular 22   | Vitest (browser)                    | [`angular-22-test`](https://github.com/atomic-testing/atomic-testing/tree/main/package-tests/angular-22-test)                                                       |
| Any (in stories)          | Storybook 10 | Vitest (browser)                    | [`storybook-test`](https://github.com/atomic-testing/atomic-testing/tree/main/package-tests/storybook-test)                                                         |

Each design system usually ships a fixture per supported major (for example
`component-driver-mui-v6`/`v7`/`v9` and `angular-material`/`angular` `v20`/`v21`/`v22`);
the table lists one representative each. Browse
[the full `package-tests/` directory](https://github.com/atomic-testing/atomic-testing/tree/main/package-tests)
to find the major that matches your project.

## How to read a fixture

Every fixture follows the shared three-file test pattern, so copying one is
mechanical:

- **`*.suite.ts`** — the `ScenePart` (locators + drivers) and the
  framework-agnostic test logic. This is the part you adapt to your component.
- **`*.dom.test.ts`** — the Jest (or Vitest) adapter that renders the example and
  runs the suite in a DOM.
- **`*.e2e.test.ts`** — the Playwright adapter that runs the same suite in a real
  browser.

The suite is written once and executed by both adapters, so the reference shows
you a single set of assertions that already passes in DOM and browser alike.

Once you have picked a stack from the table, [Scaffold in CI](./scaffold-in-ci.md)
covers driving the CLI non-interactively to generate the matching starting point.
