# Changelog

## [0.95.0] - 2026-07-06

### Features

- **primevue:** first Vue 3 design-system driver package (@atomic-testing/component-driver-primevue-v4) ([#1032](https://github.com/atomic-testing/atomic-testing/issues/1032))

### Fixes

- **angular-material:** disable test-harness animations to eliminate menu pointer-events race ([#1039](https://github.com/atomic-testing/atomic-testing/issues/1039))
- repair e2e test failures across astryx, mui, and radix drivers ([#1038](https://github.com/atomic-testing/atomic-testing/issues/1038))

## [0.94.0] - 2026-07-05

### Features

- add Angular Material component drivers for Angular 20-22 ([#1031](https://github.com/atomic-testing/atomic-testing/issues/1031))

### Fixes

- **angular:** correct zone/zoneless CD selection + add 21/22 runtime fixtures, typedoc, check:api ([#1030](https://github.com/atomic-testing/atomic-testing/issues/1030))
- **react-core:** stop act-environment warning storm that kills the Radix CI job

### Other

- Library maturity pass: governance docs, RFC template, and auto-generated CHANGELOG ([#1017](https://github.com/atomic-testing/atomic-testing/issues/1017))
- Add example-shadcn-workspace-test CI job
- Build example-shadcn-workspace: shadcn/ui workspace settings app + shared driver tests
- **example:** wire Tailwind v4 into example-shadcn-workspace
- **example:** minimal Vite+React+TS base for example-shadcn-workspace
