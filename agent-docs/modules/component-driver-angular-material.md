# Module group: component-driver-angular-material

Covers `component-driver-angular-material-v20` / `-v21` / `-v22` — drivers for
[Angular Material](https://material.angular.dev) components, one package per
Material major (ADR-003 model, like the MUI drivers). Phase 1 of #1024
scaffolded the packages with a smoke `ButtonDriver`; Phase 2 (#1026) added the
six non-overlay drivers; Phase 3 (#1027) added the four CDK-overlay drivers
(Select, Dialog, Menu, Snackbar); Phase 4 (#1028) closed the epic with the two
complex drivers (Autocomplete, Table). `MatSort`/`MatPaginator` integration is
deliberate follow-up work, not part of `TableDriver`.

## Package shape

Mirrors `component-driver-mui-v7`:

- `@angular/material` + `@angular/cdk` are **compatibility-declaration
  `dependencies`** with zero runtime imports — drivers are DOM/ARIA-contract
  based (mui precedent: `@mui/material` is a dependency never imported).
- `@atomic-testing/core`, `dom-core`, `component-driver-html`, and the
  matching `@atomic-testing/angular-2x` adapter are `workspace:*` deps.
- tsdown build, `check:type` via tsgo, standard exports map.

## Drivers

| Driver                                 | Anchors on                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | File (v20; v21/v22 are per-major copies)                                                                           |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `ButtonDriver`                         | native `<button>`/`<a>` host of `matButton`; `disabled` or `aria-disabled="true"` (`disabledInteractive`) for state                                                                                                                                                                                                                                                                                                                                                                                                                             | [ButtonDriver.ts](../../packages/component-driver-angular-material-v20/src/components/ButtonDriver.ts)             |
| `CheckboxDriver`                       | native `<input type="checkbox">` inside the `<mat-checkbox>` host; `aria-checked="mixed"` for indeterminate                                                                                                                                                                                                                                                                                                                                                                                                                                     | [CheckboxDriver.ts](../../packages/component-driver-angular-material-v20/src/components/CheckboxDriver.ts)         |
| `InputDriver`                          | `<mat-form-field>` root; `input[matInput]`/`textarea[matInput]` control; `mat-hint`/`mat-error` for messages; `aria-invalid` **or** a rendered error for `isError` (Material drops `aria-invalid` on empty required fields)                                                                                                                                                                                                                                                                                                                     | [InputDriver.ts](../../packages/component-driver-angular-material-v20/src/components/InputDriver.ts)               |
| `RadioGroupDriver`/`RadioButtonDriver` | native `<input type="radio">`s inside the `role="radiogroup"`/`<mat-radio-button>` hosts; forwarded `value` attribute                                                                                                                                                                                                                                                                                                                                                                                                                           | [RadioGroupDriver.ts](../../packages/component-driver-angular-material-v20/src/components/RadioGroupDriver.ts)     |
| `SlideToggleDriver`                    | `<button role="switch">`; `aria-checked` for state, `aria-required` (no native input exists)                                                                                                                                                                                                                                                                                                                                                                                                                                                    | [SlideToggleDriver.ts](../../packages/component-driver-angular-material-v20/src/components/SlideToggleDriver.ts)   |
| `TabsDriver`/`TabDriver`               | `role="tab"` items under the `<mat-tab-group>` host; `aria-selected`/`aria-disabled`; panel text through the `aria-controls`↔`id` link                                                                                                                                                                                                                                                                                                                                                                                                          | [TabsDriver.ts](../../packages/component-driver-angular-material-v20/src/components/TabsDriver.ts)                 |
| `SelectDriver`/`OptionDriver`          | `<mat-select>` host = the `role="combobox"` trigger (`aria-expanded`/`aria-disabled`/`aria-required`); the `role="listbox"` panel through the `aria-controls`↔`id` link; keyboard-driven open/close (Enter/Escape — the only click handler is on an inner div); value ≡ option label (no DOM value serialization exists)                                                                                                                                                                                                                        | [SelectDriver.ts](../../packages/component-driver-angular-material-v20/src/components/SelectDriver.ts)             |
| `DialogDriver`                         | re-roots to the overlay container + `role="dialog"` (`'Same'` refinement); locate by `MatDialogConfig.id` on the container; title via the `aria-labelledby`↔`id` link; backdrop-corner-click and Escape close paths; `ContainerDriver` content for the consumer's own component                                                                                                                                                                                                                                                                 | [DialogDriver.ts](../../packages/component-driver-angular-material-v20/src/components/DialogDriver.ts)             |
| `MenuDriver`/`MenuItemDriver`          | re-roots to the overlay container + `role="menu"` (`'Same'` refinement); locate by the panel's `aria-label` (the `<mat-menu aria-label>` input); `role="menuitem"` items via `listHelper`; item clicks probe the animation's `pointer-events: none` window                                                                                                                                                                                                                                                                                      | [MenuDriver.ts](../../packages/component-driver-angular-material-v20/src/components/MenuDriver.ts)                 |
| `SnackbarDriver`                       | re-roots to the overlay container; scene locator is the exported `snackbarLocator` (`<mat-snack-bar-container>` — no user-settable identity exists); label/action via the `[matSnackBarLabel]`/`[matSnackBarAction]` directive attributes; `aria-live` politeness; `waitForOpen`/`waitForClose` for auto-dismiss timing                                                                                                                                                                                                                         | [SnackbarDriver.ts](../../packages/component-driver-angular-material-v20/src/components/SnackbarDriver.ts)         |
| `AutocompleteDriver`                   | the trigger `<input [matAutocomplete]>` = the `role="combobox"` element (the driver _is_ the text input); panel through the `aria-controls`↔`id` link (SelectDriver technique — location-independent across the per-major overlay drift); panel reads guarded by `aria-expanded` (Material keeps the panel closed when filtering leaves no options); `selectByLabel`/`setValue` probe via `waitUntil` for the asynchronously filtered option                                                                                                    | [AutocompleteDriver.ts](../../packages/component-driver-angular-material-v20/src/components/AutocompleteDriver.ts) |
| `TableDriver`/`TableRowDriver`         | table host (`role="table"`); pure-ARIA row/cell anchors valid for **both** rendering variants — MatTable sets `role="row"`/`role="columnheader"`/`role="cell"` explicitly even on native `<tr>`/`<th>`/`<td>` (angular/components#29784); data rows = `[role="row"]:has([role="cell"])`, footer rows excluded by their public template selectors (ARIA-indistinguishable from data rows); `ListComponentDriver`-based (rows = items); column-addressed reads resolve through header text; `role="grid"` + `MatSort`/`MatPaginator` out of scope | [TableDriver.ts](../../packages/component-driver-angular-material-v20/src/components/TableDriver.ts)               |

**Locator rule:** anchor on ARIA roles/attributes or forwarded `data-testid`,
never on `.mat-mdc-*` classes — Angular documents them as unstable. The one
sanctioned exception is the CDK's own containment contract,
`.cdk-overlay-container`/`.cdk-overlay-backdrop`
([internal/overlayLocators.ts](../../packages/component-driver-angular-material-v20/src/internal/overlayLocators.ts)) —
the Angular counterpart of the mui drivers anchoring MUI's
`role="presentation"` portal root.

### Overlay drivers (Phase 3) — portal re-rooting and per-major drift

Overlay content renders outside both the component subtree and the test
engine's root, so Dialog/Menu/Snackbar re-root via the
`overriddenParentLocator()`/`overrideLocatorRelativePosition()` portal hooks
(mui-v7 `DialogDriver`/`MenuDriver` precedent). **Where** overlays render
drifts by major — verified against each major's real DOM in Chromium:

- **v20**: every overlay is plain positioned DOM inside
  `.cdk-overlay-container` on `document.body`.
- **v21/v22**: overlay hosts are native popovers (`popover="manual"`, browser
  Top Layer). Dialog/menu/snackbar hosts still live inside
  `.cdk-overlay-container` (the backdrop moves inside the popover host), but
  **the select panel does not** — MatSelect uses an inline popover inserted
  inside the `<mat-select>` host itself. `SelectDriver` therefore never
  re-roots: it resolves the panel through the host's `aria-controls` link,
  which is location-independent — and its open-state reads target the
  `aria-selected` option, because host text is the whole option list while
  the inline panel is up. `AutocompleteDriver` (Phase 4) adopts the same
  link-not-location technique wholesale.

Open/close state is **attachment-based** (`exists()`): the CDK detaches
overlays on close, and a style probe races the exit-animation detach
(Playwright's `locator.evaluate` would hang on the vanished element). Waits
are polling `waitUntil` probes, never sleeps; the select's close wait also
waits for the panel element's actual detach (captured by `id` beforehand),
because on v21/v22 the exiting panel lingers _inside the host_.

DOM-mode key presses only reach Material because `DOMInteractor.pressKey`
mirrors the legacy `event.keyCode` (see
[modules/dom-core.md](dom-core.md)) — Material dispatches on `keyCode`, not
`key`.

**Labels resolve through `<label for>`↔`id`** — Material links every control's
label to the control's auto-generated id, and `internal/linkedLocators.ts`
resolves that link via `byLinkedElement` (astryx precedent). Material always
renders the label element, so an empty label reports as `undefined`.

## Test packages (`package-tests/component-driver-angular-material-*-test`)

Three-file suite pattern (`*.suite.ts` + `*.dom.test.ts` + `*.e2e.test.ts`)
with an Angular twist on the DOM side:

- **DOM = Vitest browser mode through `AngularInteractor`** (not Jest+jsdom):
  ADR-013 rejected jsdom for Angular, and Material overlays lean on the native
  Popover API jsdom lacks (jsdom/jsdom#3721). Each suite runs twice — zone.js
  and zoneless projects (setup files toggle the import).
- The `.dom.test.ts` adapters pass the **async** Angular `createTestEngine`
  straight to `testRunner`; `GetTestEngine` accepts promises since #1025.
- **E2E = Playwright** against a Vite app (`src/main.ts`) that is JIT-compiled
  at runtime (`@angular/compiler` loaded; Material's partial-Ivy declarations
  runtime-link through it — no Angular build plugin). `src/directory.ts` maps
  suite `url`s to standalone components. The Playwright config auto-starts the
  dev server (ports 5220/5221/5222 for v20/v21/v22).

### Workspace gotchas (will cost an hour each)

- **Angular dedupe:** `angular-core`'s dist resolves its own devDependency
  copy of `@angular/*` (Angular 20); a v21/v22 test package therefore loads
  two Angular copies and dies with NG0203 unless its vitest config sets
  `resolve.dedupe` for `@angular/*`/`rxjs`/`zone.js` (the React-dedupe
  problem, Angular edition).
- **Cold-cache dep discovery (Vitest):** the initial optimizeDeps scan only
  sees the test files, so `@angular/material/*` entries imported by examples
  are discovered mid-run on a cold cache; the re-optimization hands the
  JIT-linked components a second, raw `@angular/core` copy (breaks with
  `firstCreatePass` of null in `providersResolver`). The vitest configs list
  every Angular entry the examples touch in `optimizeDeps.include`.
- **One `@playwright/test` instance:** the local `playwright` devDependency
  must match the workspace-root `@playwright/test` pin, or the e2e CLI and the
  adapter's import load two copies and Playwright hard-errors on
  `test.describe()`.
- **Prebuilt theme CSS** is exported only under the `style` condition — import
  it by direct file path (`../node_modules/@angular/material/prebuilt-themes/…`),
  not the bare specifier.
- **`CHROMIUM_EXECUTABLE`** points both the Vitest browser provider and the
  e2e chromium project at a preinstalled Chromium in sandboxed dev
  environments (mirrors `storybook-test`).

## Related

- [ADR-013](../adr/013-angular-shared-core-thin-packages.md) — Angular adapter layering; async `createTestEngine`.
- [modules/framework-adapters.md](framework-adapters.md) — `AngularInteractor` settling.
- [modules/component-driver-mui.md](component-driver-mui.md) — the package-shape precedent.
