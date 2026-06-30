# @atomic-testing/dom-core

Utilities for testing plain DOM elements with the Atomic Testing workflow.
This package provides the low-level engine used by browser-based adapters.

## Installation

```bash
pnpm add @atomic-testing/dom-core
```

See the [documentation](https://atomic-testing.dev/) for usage examples.

## Public API & stability

The stable surface of this package is its `.` barrel exports, frozen under
SemVer and machine-checked by the committed [API Extractor](https://api-extractor.com/)
report at [`etc/dom-core.api.md`](etc/dom-core.api.md). Exports tagged `@internal` are
not part of that guarantee. See the [1.0 API freeze & evolution policy](../../agent-docs/adr/006-1.0-api-freeze-and-evolution.md).
