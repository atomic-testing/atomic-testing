# Changelog

## [0.101.0] - 2026-08-05

### Breaking Changes

- **core:** close 1.0-readiness gaps in timing, state semantics, packaging and release ([#1375](https://github.com/atomic-testing/atomic-testing/issues/1375))
- **core:** close the breaking-if-deferred 1.0 API gaps and run core's tests ([#1304](https://github.com/atomic-testing/atomic-testing/issues/1304))

### Fixes

- **ci:** assert the tag before the gates, not after them
- **example:** migrate shadcn workspace's DangerZoneDriver off content API
- **mui-v7-test:** correct copy-paste name/description/keywords
- **mui:** drop unused react-18 hard-dependency from mui-v7/mui-v9

### Refactoring

- **fluent-v9:** one absence convention across the package ([#1305](https://github.com/atomic-testing/atomic-testing/issues/1305))

### Documentation

- **mui:** fix stale line-range anchor after react-18 dep removal

### Other

- **e2e:** unblock the e2e tier and gate it in CI ([#1303](https://github.com/atomic-testing/atomic-testing/issues/1303))

## [0.100.0] - 2026-08-02

### Breaking Changes

- **mui:** anchor Menu interiors at the menu list
- **mui:** remove dead SnackbarDriver.getActionComponent
- **core:** anchor within() at a driver-defined interiorLocator
- **core:** rename ComponentDriver.scope to within
- **core:** remove ContainerDriver and its container option types

### Features

- **core:** add ComponentDriver.scope() and deprecate ContainerDriver's content
- **component-driver-mui-x-v9:** reorderColumn for DataGridPremiumDriver
- **component-driver-mui-x-v9:** master-detail row expansion for DataGridPremiumDriver
- **component-driver-mui-v9:** add isRequired and isError for v6/v7 capability parity ([#1270](https://github.com/atomic-testing/atomic-testing/issues/1270))
- **component-driver-primevue-v4:** add filtering, cell editing, virtual scroll support ([#1034](https://github.com/atomic-testing/atomic-testing/issues/1034)) ([#1269](https://github.com/atomic-testing/atomic-testing/issues/1269))
- **component-driver-reka-ui-v2:** complete Reka UI driver coverage ([#1152](https://github.com/atomic-testing/atomic-testing/issues/1152))
- **dom-core,playwright,core:** HTML5 drag-and-drop, findByRole, pressKey cross-engine parity ([#1153](https://github.com/atomic-testing/atomic-testing/issues/1153))
- **component-driver-astryx:** add LightboxDriver
- **component-driver-primevue-v4:** ContextMenu driver + shared menu-content base ([#1036](https://github.com/atomic-testing/atomic-testing/issues/1036))
- **component-driver-reka-ui-v2:** new Vue 3 driver package for Reka UI ([#1037](https://github.com/atomic-testing/atomic-testing/issues/1037))
- **component-driver-primevue-v4:** DataTable sorting, selection, pagination ([#1034](https://github.com/atomic-testing/atomic-testing/issues/1034))
- **component-driver-primevue-v4:** slider range + vertical orientation ([#1035](https://github.com/atomic-testing/atomic-testing/issues/1035))
- **component-driver-primevue-v4:** support appendTo="self" overlays ([#1033](https://github.com/atomic-testing/atomic-testing/issues/1033))
- **core:** let a driver's portal re-root vary per scene instance

### Fixes

- **scaffolder:** regenerate embedded skill content
- **example:** keep shadcn workspace on the deprecated content channel
- **component-driver-mui-x-v9:** harden master-detail and reorderColumn per review
- **component-driver-astryx:** scope the ChatSendButton aria-label selector
- **ci:** offset dependabot triage cron off the top-of-hour minutes ([#1273](https://github.com/atomic-testing/atomic-testing/issues/1273))
- **ci:** pin pnpm version and unfreeze lockfile in dependabot triage workflow ([#1272](https://github.com/atomic-testing/atomic-testing/issues/1272))
- **playwright:** resolve missing-element and append bugs found by the new conformance suite ([#1154](https://github.com/atomic-testing/atomic-testing/issues/1154))
- **core,dom-core,playwright:** validate clickCount and fix positioned double-click sequence
- **component-driver-primevue-v4:** ContextMenu open() no longer no-ops on another open instance
- **component-driver-primevue-v4:** address further Copilot review comments on DataTableDriver
- **component-driver-reka-ui-v2:** bump version to 0.99.0 to match lockstep release
- **component-driver-primevue-v4:** address Copilot review comments on PR [#1145](https://github.com/atomic-testing/atomic-testing/issues/1145)

### Refactoring

- **ci:** replace scheduled triage workflow with a standalone local script ([#1274](https://github.com/atomic-testing/atomic-testing/issues/1274))

### Documentation

- **adr:** correct the Angular Material rows of the rollout-width audit
- **component-driver-astryx:** document the Wave 4 driver set
- **component-driver-astryx:** fix duplicate const in README engine snippet
- **component-driver-astryx:** lead README with atomic-testing's mission, add usage example
- **component-driver-primevue-v4:** update driver table for [#1033](https://github.com/atomic-testing/atomic-testing/issues/1033)/[#1034](https://github.com/atomic-testing/atomic-testing/issues/1034)/[#1035](https://github.com/atomic-testing/atomic-testing/issues/1035)

### Build & Tooling

- **deps-dev:** bump playwright from 1.56.1 to 1.62.0 in /package-tests/component-driver-angular-material-v20-test ([#1290](https://github.com/atomic-testing/atomic-testing/issues/1290))
- **deps:** bump @angular/forms from 20.3.25 to 20.3.26 in /package-tests/component-driver-angular-material-v20-test ([#1289](https://github.com/atomic-testing/atomic-testing/issues/1289))
- **deps-dev:** bump @storybook/react-vite from 10.4.6 to 10.5.5 in /package-tests/storybook-test ([#1287](https://github.com/atomic-testing/atomic-testing/issues/1287))
- **deps-dev:** bump storybook from 10.4.6 to 10.5.5 in /package-tests/storybook-test ([#1285](https://github.com/atomic-testing/atomic-testing/issues/1285))
- **deps-dev:** bump zone.js from 0.15.1 to 0.16.2 in /package-tests/angular-20-test ([#1284](https://github.com/atomic-testing/atomic-testing/issues/1284))
- **deps-dev:** bump playwright from 1.56.1 to 1.62.0 in /package-tests/storybook-test ([#1283](https://github.com/atomic-testing/atomic-testing/issues/1283))
- **deps-dev:** bump @vitejs/plugin-react from 6.0.2 to 6.0.4 in /package-tests/storybook-test ([#1282](https://github.com/atomic-testing/atomic-testing/issues/1282))
- **deps-dev:** bump @playwright/test from 1.61.1 to 1.62.0 ([#1276](https://github.com/atomic-testing/atomic-testing/issues/1276))
- **deps:** bump @mui/x-tree-view from 9.7.0 to 9.10.1 in /package-tests/component-driver-mui-x-v9-test ([#1259](https://github.com/atomic-testing/atomic-testing/issues/1259))
- **deps:** bump zone.js from 0.15.1 to 0.16.2 in /package-tests/component-driver-angular-material-v22-test ([#1258](https://github.com/atomic-testing/atomic-testing/issues/1258))
- **deps:** bump @mui/x-charts from 9.9.0 to 9.10.1 in /package-tests/component-driver-mui-x-v9-test ([#1257](https://github.com/atomic-testing/atomic-testing/issues/1257))
- **deps:** bump @mui/x-data-grid-premium from 9.7.0 to 9.10.1 in /package-tests/component-driver-mui-x-v9-test ([#1256](https://github.com/atomic-testing/atomic-testing/issues/1256))
- **deps-dev:** bump playwright from 1.56.1 to 1.61.1 in /package-tests/angular-22-test ([#1246](https://github.com/atomic-testing/atomic-testing/issues/1246))
- **deps:** bump vue from 3.5.39 to 3.5.40 in /package-tests/component-driver-reka-ui-test ([#1231](https://github.com/atomic-testing/atomic-testing/issues/1231))
- **deps-dev:** bump @vue/compiler-sfc from 3.5.39 to 3.5.40 in /package-tests/component-driver-reka-ui-test ([#1230](https://github.com/atomic-testing/atomic-testing/issues/1230))
- **deps:** bump radix-ui from 1.6.1 to 1.6.5 in /package-tests/component-driver-radix-test ([#1222](https://github.com/atomic-testing/atomic-testing/issues/1222))
- **deps:** bump zone.js from 0.15.1 to 0.16.2 in /package-tests/component-driver-angular-material-v20-test ([#1202](https://github.com/atomic-testing/atomic-testing/issues/1202))
- **deps:** bump @angular/common from 20.3.25 to 20.3.26 in /package-tests/component-driver-angular-material-v20-test ([#1201](https://github.com/atomic-testing/atomic-testing/issues/1201))
- **deps-dev:** bump zone.js from 0.15.1 to 0.16.2 in /packages/angular-core ([#1163](https://github.com/atomic-testing/atomic-testing/issues/1163))
- **deps-dev:** bump @angular/core from 20.3.25 to 20.3.26 in /package-tests/angular-20-test ([#1160](https://github.com/atomic-testing/atomic-testing/issues/1160))
- **deps-dev:** bump zone.js from 0.15.1 to 0.16.2 in /packages/angular-21 ([#1159](https://github.com/atomic-testing/atomic-testing/issues/1159))
- **deps-dev:** bump @vitest/browser-playwright from 4.1.9 to 4.1.10 in /package-tests/angular-20-test ([#1157](https://github.com/atomic-testing/atomic-testing/issues/1157))
- **deps-dev:** bump zone.js from 0.15.1 to 0.16.2 in /packages/angular-20 ([#1156](https://github.com/atomic-testing/atomic-testing/issues/1156))
- **deps-dev:** bump playwright from 1.56.1 to 1.61.1 in /package-tests/angular-21-test ([#1162](https://github.com/atomic-testing/atomic-testing/issues/1162))
- **deps-dev:** bump @vitest/browser-playwright from 4.1.9 to 4.1.10 in /package-tests/component-driver-angular-material-v21-test ([#1255](https://github.com/atomic-testing/atomic-testing/issues/1255))
- **deps-dev:** bump vitest from 4.1.9 to 4.1.10 in /package-tests/component-driver-angular-material-v21-test ([#1207](https://github.com/atomic-testing/atomic-testing/issues/1207))
- **deps-dev:** bump @vitest/browser-playwright from 4.1.9 to 4.1.10 in /package-tests/component-driver-angular-material-v22-test ([#1219](https://github.com/atomic-testing/atomic-testing/issues/1219))
- **deps-dev:** bump @storybook/vue3-vite from 8.6.14 to 8.6.18 in /package-tests/vue-3-test ([#1265](https://github.com/atomic-testing/atomic-testing/issues/1265))
- **deps-dev:** bump @storybook/react-vite from 10.4.6 to 10.5.4 in /package-tests/storybook-test ([#1266](https://github.com/atomic-testing/atomic-testing/issues/1266))
- **deps-dev:** bump @storybook/addon-themes from 8.6.14 to 8.6.18 in /package-tests/vue-3-test ([#1267](https://github.com/atomic-testing/atomic-testing/issues/1267))
- **deps-dev:** bump @vue/compiler-dom from 3.5.39 to 3.5.40 in /package-tests/vue-3-test ([#1268](https://github.com/atomic-testing/atomic-testing/issues/1268))
- **deps-dev:** bump vitest from 4.1.9 to 4.1.10 in /package-tests/component-driver-angular-material-v22-test ([#1261](https://github.com/atomic-testing/atomic-testing/issues/1261))
- **deps:** bump zone.js from 0.15.1 to 0.16.2 in /package-tests/component-driver-angular-material-v21-test ([#1254](https://github.com/atomic-testing/atomic-testing/issues/1254))
- **deps-dev:** bump vitest from 4.1.9 to 4.1.10 in /package-tests/angular-22-test ([#1250](https://github.com/atomic-testing/atomic-testing/issues/1250))
- **deps-dev:** bump zone.js from 0.15.1 to 0.16.2 in /package-tests/angular-22-test ([#1248](https://github.com/atomic-testing/atomic-testing/issues/1248))
- **deps-dev:** bump zone.js from 0.15.1 to 0.16.2 in /package-tests/angular-21-test ([#1247](https://github.com/atomic-testing/atomic-testing/issues/1247))
- **deps-dev:** bump vitest from 4.1.9 to 4.1.10 in /package-tests/storybook-test ([#1242](https://github.com/atomic-testing/atomic-testing/issues/1242))
- **deps-dev:** bump @storybook/test from 8.6.14 to 8.6.15 in /package-tests/vue-3-test ([#1239](https://github.com/atomic-testing/atomic-testing/issues/1239))
- **deps:** bump @vue/compiler-sfc from 3.5.39 to 3.5.40 in /packages/vue-3 ([#1236](https://github.com/atomic-testing/atomic-testing/issues/1236))
- **deps:** bump @fluentui/react-components from 9.74.3 to 9.74.4 in /package-tests/component-driver-fluent-v9-test ([#1232](https://github.com/atomic-testing/atomic-testing/issues/1232))
- **deps-dev:** bump @vue/compiler-sfc from 3.5.39 to 3.5.40 in /package-tests/component-driver-primevue-test ([#1228](https://github.com/atomic-testing/atomic-testing/issues/1228))
- **deps-dev:** bump vue from 3.5.39 to 3.5.40 in /packages/component-driver-reka-ui-v2 ([#1226](https://github.com/atomic-testing/atomic-testing/issues/1226))
- **deps-dev:** bump @vitest/browser-playwright from 4.1.9 to 4.1.10 in /package-tests/component-driver-angular-material-v20-test ([#1205](https://github.com/atomic-testing/atomic-testing/issues/1205))
- **deps:** bump @angular/core from 20.3.25 to 20.3.26 in /package-tests/component-driver-angular-material-v20-test ([#1204](https://github.com/atomic-testing/atomic-testing/issues/1204))
- **deps:** bump @angular/platform-browser from 20.3.25 to 20.3.26 in /package-tests/component-driver-angular-material-v20-test ([#1203](https://github.com/atomic-testing/atomic-testing/issues/1203))
- **deps:** bump @astryxdesign/theme-neutral from 0.1.3 to 0.1.8 ([#1196](https://github.com/atomic-testing/atomic-testing/issues/1196))
- **deps-dev:** bump @vitest/browser-playwright from 4.1.9 to 4.1.10 in /package-tests/angular-22-test ([#1190](https://github.com/atomic-testing/atomic-testing/issues/1190))
- **deps-dev:** bump zone.js from 0.15.1 to 0.16.2 in /packages/angular-22 ([#1173](https://github.com/atomic-testing/atomic-testing/issues/1173))
- **deps-dev:** bump vitest from 4.1.9 to 4.1.10 in /package-tests/angular-20-test ([#1171](https://github.com/atomic-testing/atomic-testing/issues/1171))
- **deps:** extend DEP-PIN-01 for gaps found in post-[#1150](https://github.com/atomic-testing/atomic-testing/issues/1150) PRs ([#1245](https://github.com/atomic-testing/atomic-testing/issues/1245))
- **deps-dev:** bump @vitest/browser-playwright from 4.1.9 to 4.1.10 in /package-tests/storybook-test ([#1243](https://github.com/atomic-testing/atomic-testing/issues/1243))
- **deps-dev:** bump storybook from 10.4.6 to 10.5.3 in /package-tests/storybook-test ([#1244](https://github.com/atomic-testing/atomic-testing/issues/1244))

### Other

- **publish:** fix the second instance of the overstated isolation claim
- **publish:** address review — semver hyphens, push retry, accurate comment
- **publish:** isolate the push credential and pin npm on the release path
- Upgrade component-driver-astryx to Astryx 0.1.9 (from 0.1.3)
- add automated dependabot PR triage workflow ([#1271](https://github.com/atomic-testing/atomic-testing/issues/1271))
- Address review: check peerDependencies too, minimize lockfile diff
- Close dependabot.yml coverage gaps and wire up the DEP-PIN-01 CI gate
- Add DEP-PIN-01 gate: verify major-version-scoped packages match their own pin

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
