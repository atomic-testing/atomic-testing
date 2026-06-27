# Atomic Testing

[![NPM version](https://img.shields.io/npm/v/@atomic-testing/core.svg?style=flat)](https://www.npmjs.com/package/@atomic-testing/core)
![NPM license](https://img.shields.io/npm/l/@atomic-testing/core.svg?style=flat)

Portable UI testing utilities that unify test code across frameworks and
libraries. The project provides a collection of packages for describing UI scenes
and interacting with components consistently whether you test with React, Playwright or
other tooling.

Documentation is available at [https://atomic-testing.dev/](https://atomic-testing.dev/).

## Packages

This repository contains multiple packages under the `packages/` directory,
including but not limited to:

- **`@atomic-testing/core`** – core APIs for defining scene parts and running
  tests.
- **`@atomic-testing/react-legacy`**, **`@atomic-testing/react-18`**, and
  **`@atomic-testing/react-19`** – adapters for React applications.
- **`@atomic-testing/playwright`** – integration with Playwright for end-to-end
  tests.
- **Component driver packages** such as
  `@atomic-testing/component-driver-html` and Material UI variants, used to
  drive specific UI components.

  runner.

## Version support policy

Material UI moves fast and each major has a distinct rendered DOM, so this
project ships one driver package per MUI major (see
[ADR-003](agent-docs/adr/003-version-specific-packages.md)). To keep the
maintained surface focused, older majors reach **end of support** once newer
ones are stable.

| Driver family | Supported majors | End of support            |
| ------------- | ---------------- | ------------------------- |
| MUI (core)    | v6, v7           | **v5 - ended 2026-06-27** |
| MUI-X         | v6, v7, v8       | **v5 - ended 2026-06-27** |

**MUI 5 / MUI-X 5 are no longer supported** as of **2026-06-27**. The
`@atomic-testing/component-driver-mui-v5` and
`@atomic-testing/component-driver-mui-x-v5` packages are frozen at `0.81.0`:
they remain installable at that version but receive no fixes, new drivers, or
CI/e2e coverage, and their test suites no longer run. New work targets v6/v7
(MUI-X also v8). Rationale and migration notes:
[ADR-005](agent-docs/adr/005-drop-mui-5-support.md).

> Note: the MUI-X date/time **picker** drivers only ever shipped in the v5
> package; they have no v6–v8 successor at this time.

## Getting Started

1. Install Node.js (v22.12 or newer) and [pnpm](https://pnpm.io/) (v10 or newer).
2. Install the dependencies:

   ```bash
   pnpm install
   ```

3. Add the packages you need to your project. A minimal setup might include the
   core and React packages:

   ```bash
   pnpm add @atomic-testing/core @atomic-testing/react-18
   ```

   Additional component drivers can be installed in the same way, for example:

   ```bash
   pnpm add @atomic-testing/component-driver-html
   ```

4. Define your scene parts, create a test engine using the adapter for your
   framework, and write tests that interact with the scene.

For detailed guides and examples, see the [online documentation](https://atomic-testing.dev/).

## Contributing

Pull requests are welcome. Before submitting, run the checks defined in the root
`package.json`:

```bash
pnpm run check:lint
pnpm run check:style
pnpm run check:types
```
