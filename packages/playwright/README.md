# @atomic-testing/playwright

[![NPM version](https://img.shields.io/npm/v/@atomic-testing/playwright.svg?style=flat)](https://www.npmjs.com/package/@atomic-testing/playwright)
![NPM license](https://img.shields.io/npm/l/@atomic-testing/playwright.svg?style=flat)

This package connects Atomic Testing with [Playwright](https://playwright.dev) so you can write cross-framework UI tests.

## Installation

```bash
pnpm add @atomic-testing/playwright
```

See the [docs](https://atomic-testing.dev/) for configuration and usage details.

## Public API & stability

The stable surface of this package is its `.` barrel exports, frozen under
SemVer and machine-checked by the committed [API Extractor](https://api-extractor.com/)
report at [`etc/playwright.api.md`](https://github.com/atomic-testing/atomic-testing/blob/main/packages/playwright/etc/playwright.api.md). Exports tagged `@internal` are
not part of that guarantee. See the [1.0 API freeze & evolution policy](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/006-1.0-api-freeze-and-evolution.md).
