# Changelog

## [0.99.0] - 2026-07-22

### Breaking Changes

- **core:** collapse PartLocator to always be a chain, move `.and()` to locatorUtil ([#1144](https://github.com/atomic-testing/atomic-testing/issues/1144))

### Features

- **component-driver-fluent-v9:** add TableCellActions and keyboard-resize drivers ([#1143](https://github.com/atomic-testing/atomic-testing/issues/1143))
- **component-driver-fluent-v9:** add FlatTree/FlatTreeItem drivers ([#1142](https://github.com/atomic-testing/atomic-testing/issues/1142))
- **component-driver-fluent-v9:** add Wave 6 complex/composite drivers (Table/DataGrid, Tree, Carousel)
- **component-driver-fluent-v9:** add Wave 5 data display & feedback drivers ([#1131](https://github.com/atomic-testing/atomic-testing/issues/1131))
- **component-driver-fluent-v9:** add Wave 4 navigation & disclosure drivers ([#1127](https://github.com/atomic-testing/atomic-testing/issues/1127))
- **component-driver-fluent-v9:** add drivers for 10 additional Fluent components ([#1125](https://github.com/atomic-testing/atomic-testing/issues/1125))
- **component-driver-fluent-v9:** add Wave 2 overlay & menu drivers ([#1122](https://github.com/atomic-testing/atomic-testing/issues/1122))

### Fixes

- **component-driver-fluent-v9:** correct doc/behavior mismatches flagged by Copilot review
- **mui:** give a late close-transition timer real wall-clock time before giving up ([#1124](https://github.com/atomic-testing/atomic-testing/issues/1124))

### Documentation

- **agent-docs:** add standalone guide for adopting an LSP for AI coding agents ([#1129](https://github.com/atomic-testing/atomic-testing/issues/1129))
- remove internal delivery-sequencing jargon from published docs ([#1123](https://github.com/atomic-testing/atomic-testing/issues/1123))
- reorganize getting-started and package-selection flow ([#1120](https://github.com/atomic-testing/atomic-testing/issues/1120))
- **support-matrix:** redesign as the Atomic Table + tier matrix ([#1119](https://github.com/atomic-testing/atomic-testing/issues/1119))

### Build & Tooling

- **deps-dev:** bump typedoc from 0.28.19 to 0.28.20
- **deps-dev:** bump @vitejs/plugin-vue from 5.2.4 to 6.0.8
- **deps-dev:** bump oxfmt from 0.55.0 to 0.58.0 ([#1113](https://github.com/atomic-testing/atomic-testing/issues/1113))
- **deps:** bump @mui/icons-material from 5.17.1 to 7.3.11 in /package-tests/component-driver-mui-x-v8-test ([#1110](https://github.com/atomic-testing/atomic-testing/issues/1110))
- **deps:** bump @mui/x-charts from 9.7.0 to 9.9.0 ([#1107](https://github.com/atomic-testing/atomic-testing/issues/1107))
- install examples/* on setup, standardize their workspace pattern, bump to 0.97.0 ([#1118](https://github.com/atomic-testing/atomic-testing/issues/1118))

## [0.98.0] - 2026-07-14

### Features

- **fluent-v9:** add Fluent UI v9 driver package, test infra, and Wave 1 drivers ([#1116](https://github.com/atomic-testing/atomic-testing/issues/1116))
- **create-atomic-testing:** point --agents users at skills docs in CLI output
- **skills:** check:skill-sync gate against library drift
- **create-atomic-testing:** scaffold the testing skills into new projects
- **skills:** golden-fixture regression harness for driver decomposition
- **skills:** add adopter-facing testing-lifecycle skill family
- **create-atomic-testing:** guard against version + registry drift

### Fixes

- **skills:** address Copilot review comments on [#1115](https://github.com/atomic-testing/atomic-testing/issues/1115)
- **create-atomic-testing:** sync ATOMIC_VERSION to 0.97.0; address PR review

### Documentation

- **quick-start:** document the skill + CLAUDE.md scaffolding output
- **create-atomic-testing:** document the --agents/--no-agents flag
- **framework-guide:** fix wrong Vuetify/MUI recommendation, dedupe install commands
- **guides:** add "Decomposing driver trees" decomposition guide
- make the Vue + Jest verified path turnkey; oxfmt pass
- CLI-first onboarding around create-atomic-testing (RFC [#1095](https://github.com/atomic-testing/atomic-testing/issues/1095))

## [0.97.0] - 2026-07-12

### Features

- **create-atomic-testing:** add Storybook-style onboarding scaffolder CLI
- **mui-x-v9:** picker/DataGrid/chart drivers on a new typeText keystroke primitive ([#903](https://github.com/atomic-testing/atomic-testing/issues/903), [#904](https://github.com/atomic-testing/atomic-testing/issues/904)) ([#1085](https://github.com/atomic-testing/atomic-testing/issues/1085))

### Fixes

- **create-atomic-testing:** address PR review comments
- **create-atomic-testing:** resolve correctness issues from adversarial review
- **repo:** drop toolchain devDep bumps that broke the API-freeze gate
- **interactor:** correct cross-environment isVisible & mouseMove, add getElementCount, unify React/Vue flushing ([#1084](https://github.com/atomic-testing/atomic-testing/issues/1084))
- **docs:** unbreak the API docs build broken by a bare HTML tag in TSDoc ([#1083](https://github.com/atomic-testing/atomic-testing/issues/1083))

### Refactoring

- **create-atomic-testing:** apply /simplify cleanup pass
- **core:** facet Interactor, pay down type debt, add Child locator position

### Documentation

- **docs:** skip API packages that generated no docs
- **docs:** reorganize API reference sidebar by package; document build
- **core:** correct the 'Descendant' default-builder note
- **core:** record facet split in ADR-007 and [#1058](https://github.com/atomic-testing/atomic-testing/issues/1058) reshape deferral; harden Child tests
- **docs:** flatten TypeDoc kind-groups in sidebar, fix API nav landing page ([#1091](https://github.com/atomic-testing/atomic-testing/issues/1091))
- **docs:** restructure API reference by framework vs. component driver ([#1088](https://github.com/atomic-testing/atomic-testing/issues/1088)) ([#1089](https://github.com/atomic-testing/atomic-testing/issues/1089))
- remove EOL MUI v5 and MUI-X v5 documentation ([#1087](https://github.com/atomic-testing/atomic-testing/issues/1087))
- add resizable sidebar with fluid content layout ([#1086](https://github.com/atomic-testing/atomic-testing/issues/1086))

### Build & Tooling

- **deps:** bump react-dom and @types/react-dom in /package-tests/component-driver-html-test ([#1061](https://github.com/atomic-testing/atomic-testing/issues/1061))
- **deps:** bump @mui/x-data-grid-generator from 6.20.5 to 7.29.13 in /package-tests/component-driver-mui-x-v8-test ([#1062](https://github.com/atomic-testing/atomic-testing/issues/1062))
- **deps:** bump react-router-dom from 7.18.0 to 7.18.1 in /package-tests/component-driver-mui-v6-test ([#1063](https://github.com/atomic-testing/atomic-testing/issues/1063))
- **deps:** bump react-router-dom from 7.18.0 to 7.18.1 in /package-tests/component-driver-mui-x-v7-test ([#1064](https://github.com/atomic-testing/atomic-testing/issues/1064))
- **deps:** bump @mui/icons-material from 5.17.1 to 7.3.11 in /package-tests/component-driver-mui-v7-test ([#1065](https://github.com/atomic-testing/atomic-testing/issues/1065))
- **deps:** bump react-router-dom from 7.18.0 to 7.18.1 in /package-tests/component-driver-mui-x-v8-test ([#1066](https://github.com/atomic-testing/atomic-testing/issues/1066))
- **deps:** bump react and @types/react in /package-tests/component-driver-html-test ([#1067](https://github.com/atomic-testing/atomic-testing/issues/1067))
- **deps:** bump react-router-dom from 7.18.0 to 7.18.1 in /package-tests/component-driver-mui-v7-test ([#1068](https://github.com/atomic-testing/atomic-testing/issues/1068))
- **deps:** bump react-dom and @types/react-dom in /package-tests/component-driver-mui-x-v7-test ([#1069](https://github.com/atomic-testing/atomic-testing/issues/1069))
- **deps:** bump react-router-dom from 7.18.0 to 7.18.1 in /package-tests/component-driver-mui-x-v6-test ([#1070](https://github.com/atomic-testing/atomic-testing/issues/1070))
- **deps:** bump react-router-dom from 7.18.0 to 7.18.1 in /package-tests/component-driver-html-test ([#1071](https://github.com/atomic-testing/atomic-testing/issues/1071))
- **deps:** bump @mui/material from 5.17.1 to 7.3.11 in /package-tests/component-driver-mui-v7-test ([#1072](https://github.com/atomic-testing/atomic-testing/issues/1072))
- **deps:** bump react and @types/react in /package-tests/component-driver-mui-x-v7-test ([#1073](https://github.com/atomic-testing/atomic-testing/issues/1073))
- **deps:** bump react-dom and @types/react-dom in /package-tests/component-driver-mui-x-v8-test ([#1074](https://github.com/atomic-testing/atomic-testing/issues/1074))
- **deps:** bump react and @types/react in /package-tests/component-driver-mui-x-v8-test ([#1075](https://github.com/atomic-testing/atomic-testing/issues/1075))
- **deps:** bump @mui/material from 5.17.1 to 7.3.11 in /package-tests/component-driver-mui-x-v8-test ([#1076](https://github.com/atomic-testing/atomic-testing/issues/1076))
- **deps:** bump vue from 3.5.17 to 3.5.39 ([#1077](https://github.com/atomic-testing/atomic-testing/issues/1077))
- **deps:** bump @testing-library/react from 16.3.0 to 16.3.2 ([#1080](https://github.com/atomic-testing/atomic-testing/issues/1080))

### Other

- Relax Claude sandbox running inside Claude Desktop
- Update lint and format

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
