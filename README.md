# Atomic Testing

[![NPM version](https://img.shields.io/npm/v/@atomic-testing/core.svg?style=flat)](https://www.npmjs.com/package/@atomic-testing/core)
![NPM license](https://img.shields.io/npm/l/@atomic-testing/core.svg?style=flat)
[![CI](https://github.com/atomic-testing/atomic-testing/actions/workflows/buildui.yml/badge.svg)](https://github.com/atomic-testing/atomic-testing/actions/workflows/buildui.yml)

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

## Stability & version support policy

The stable public API is the `.` barrel exports of the in-scope packages —
`core`, `dom-core`, `react-core`, `react-18`, `react-19`, `react-legacy`,
`vue-3`, `playwright`, and `component-driver-html`. That surface is frozen under
SemVer, machine-checked by a committed [API Extractor](https://api-extractor.com/)
report per package (`etc/<package>.api.md`), and governed by a documented
deprecation lifecycle. Anything else — every `@atomic-testing/internal-*` package
and every export tagged `@internal` — is not covered by the guarantee.
Full policy, including the framework/Playwright/Node support matrix:
[ADR-006](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/006-1.0-api-freeze-and-evolution.md).

### MUI driver majors

Material UI moves fast and each major has a distinct rendered DOM, so this
project ships one driver package per MUI major (see
[ADR-003](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/003-version-specific-packages.md)). To keep the
maintained surface focused, older majors reach **end of support** once newer
ones are stable.

| Driver family | Supported majors | End of support            |
| ------------- | ---------------- | ------------------------- |
| MUI (core)    | v6, v7, v9       | **v5 - ended 2026-06-27** |
| MUI-X         | v6, v7, v8, v9   | **v5 - ended 2026-06-27** |

**MUI 5 / MUI-X 5 are no longer supported** as of **2026-06-27**. The
`@atomic-testing/component-driver-mui-v5` and
`@atomic-testing/component-driver-mui-x-v5` packages remain installable at
`0.81.0` but receive no fixes, new drivers, or CI/e2e coverage. Their source
and full history have been extracted to
[atomic-testing/component-driver-mui-v5](https://github.com/atomic-testing/component-driver-mui-v5).
New work targets v6/v7/v9 (MUI-X also v8 and v9). Rationale and migration
notes:
[ADR-005](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/005-drop-mui-5-support.md).

> Note: MUI Core has **no v8** — it jumped `7.3.11 → 9.0.0` to unify versioning
> with MUI X, so `@atomic-testing/component-driver-mui-v9` is the successor to v7
> (there is no `-mui-v8` package).
>
> Note: the MUI-X date/time **picker** drivers originally shipped only in the v5
> package. The v9 package revives a read-capable `DesktopDatePicker` driver
> (rewritten for the v9 `PickersSectionList` field DOM); writing a value and the
> other picker variants are tracked as follow-ups.

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

## Architecture & design decisions

Design rationale for major decisions — the component-driver pattern,
versioning policy, locator boundaries — is recorded as ADRs (architecture
decision records). See the ADR table in
[`agent-docs/INDEX.md`](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/INDEX.md)
for the full list.

See [`ROADMAP.md`](https://github.com/atomic-testing/atomic-testing/blob/main/ROADMAP.md)
for a summary of what's currently being worked on.

## Contributing

Pull requests are welcome. Before submitting, run:

```bash
pnpm run check:type
pnpm run check:lint
pnpm run check:style
pnpm test:dom
pnpm test:e2e
```

See [`CONTRIBUTING.md`](https://github.com/atomic-testing/atomic-testing/blob/main/CONTRIBUTING.md)
for full contribution guidelines, including dev setup and commit message
conventions. For reporting a security vulnerability, see
[`SECURITY.md`](https://github.com/atomic-testing/atomic-testing/blob/main/SECURITY.md).
