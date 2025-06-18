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
- **`@atomic-testing/react`** – adapter for React 18 and later.
- **`@atomic-testing/react-17`** – legacy adapter for React 17 and earlier.
- **`@atomic-testing/playwright`** – integration with Playwright for end-to-end
  tests.
- **Component driver packages** such as
  `@atomic-testing/component-driver-html` and Material UI variants, used to
  drive specific UI components.

  runner.

## Getting Started

1. Install Node.js (v22.12 or newer) and [pnpm](https://pnpm.io/) (v10 or newer).
2. Install the dependencies:

   ```bash
   pnpm install
   ```

3. Add the packages you need to your project. A minimal setup might include the
   core and React packages:

   ```bash
   pnpm add @atomic-testing/core @atomic-testing/react
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
