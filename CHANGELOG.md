# Changelog

## [0.96.0] - 2026-07-08

### Breaking Changes

- **core:** fix interactor read-path defects and narrow ComponentDriver primitives ([#1082](https://github.com/atomic-testing/atomic-testing/issues/1082))
- **astryx:** upgrade to 0.1.3 and add disabledMessage coverage ([#1060](https://github.com/atomic-testing/atomic-testing/issues/1060))

### Features

- **docs:** partition generated API pages into own/inherited/protected sections

### Fixes

- **docs:** harden empty-group guard and avoid O(n^2) array copies in partition plugin
- patch transitive dev-dependency vulnerabilities via pnpm overrides

### Documentation

- use -D for homepage hero install commands
- remove dead HowItWorksSection CSS from homepage stylesheet
- record the B+ push session in the launch-readiness scorecard
- fix stale MUI/MUI-X driver tables and missing locator (round 8)
- fix Vue Vitest ReferenceError, Playwright install, footer link (round 7)
- fix broken diagram deep-links, walkthrough/IA structure (round 6)
- fix Vue prop-passing overclaim, homepage/API self-contradictions (round 5)
- dedupe jest.config.js, add ESM callout, homepage polish (round 4)
- fix critical quick-start install bug and remaining drift (round 3)
- fix editUrl 404s and extend API overview to all packages ([#943](https://github.com/atomic-testing/atomic-testing/issues/943))
- document ContainerDriver/ListComponentDriver, add StorybookInteractor, fix custom-interactor claim ([#941](https://github.com/atomic-testing/atomic-testing/issues/941))
- add missing peer-dep installs, fix cleanUp/version defaults ([#940](https://github.com/atomic-testing/atomic-testing/issues/940))
- cross-link intro/why-atomic-testing, thicken RTL comparison ([#942](https://github.com/atomic-testing/atomic-testing/issues/942)/[#943](https://github.com/atomic-testing/atomic-testing/issues/943))
- sync homepage hero with active tab, add pain statement ([#942](https://github.com/atomic-testing/atomic-testing/issues/942))
- fix RTL misattribution and fake Bootstrap driver claims ([#939](https://github.com/atomic-testing/atomic-testing/issues/939))
- link the two orphaned guide pages ([#943](https://github.com/atomic-testing/atomic-testing/issues/943))
- add AngularInteractor to architecture diagram and guide ([#941](https://github.com/atomic-testing/atomic-testing/issues/941))
- fix MUI core capability-table drift ([#939](https://github.com/atomic-testing/atomic-testing/issues/939))

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
