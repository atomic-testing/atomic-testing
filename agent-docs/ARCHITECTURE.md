# Atomic Testing — Architecture

How the pieces connect at runtime. Terms are defined in [DOMAIN.md](DOMAIN.md). Source citations point at `../packages/...`.

## Entry points

A test always starts by building a `TestEngine` with an environment-specific factory. All factories produce the same `TestEngine<T>` type; they differ only in which `Interactor` they inject and how they render/clean up.

| Factory | Environment | Interactor injected | File |
|---------|-------------|---------------------|------|
| `createDomTestEngine(element, parts)` | Raw DOM (pre-rendered) | `DOMInteractor` | [dom-core/createDomTestEngine.ts](../packages/dom-core/src/createDomTestEngine.ts#L13) |
| `createTestEngine(node, parts, opt?)` | React 18 / 19 | `ReactInteractor` (`createRoot`) | [react-18/createTestEngine.ts](../packages/react-18/src/createTestEngine.ts#L25) |
| `createTestEngine(node, parts, opt?)` | React ≤17 | `ReactInteractor` (`ReactDOM.render`) | [react-legacy/createTestEngine.ts](../packages/react-legacy/src/createTestEngine.ts#L25) |
| `createTestEngine(component, parts, opt?)` | Vue 3 | `VueInteractor` | [vue-3/createTestEngine.ts](../packages/vue-3/src/createTestEngine.ts#L50) |
| `createTestEngine(page, parts)` | Playwright (browser) | `PlaywrightInteractor` | [playwright/createTestEngine.ts](../packages/playwright/src/createTestEngine.ts#L14) |
| `createRenderedTestEngine(rootEl, parts)` | React/Vue, already rendered (e.g. Storybook) | React/Vue interactor | [react-18](../packages/react-18/src/createTestEngine.ts#L65), [vue-3](../packages/vue-3/src/createTestEngine.ts#L98) |

`TestEngine`'s constructor is `(locator, interactor, option?, cleanUp?)` ([TestEngine.ts#L23-L31](../packages/core/src/TestEngine.ts#L23-L31)). DOM/Playwright engines use an empty `[]` root locator; React/Vue engines tag their mount container with a `data-*` attribute and use `byAttribute(...)` as the root.

## Layer stack

```mermaid
flowchart TD
    Test["Test code"] --> Engine["TestEngine&lt;T&gt;<br/>(root ComponentDriver + cleanUp)"]
    Engine --> Driver["ComponentDriver&lt;T&gt;<br/>semantic API: click / getValue / getText / waitUntil…"]
    Driver --> Interactor["Interactor (interface)<br/>environment adapter"]
    Driver --> Locator["PartLocator<br/>CSS selector chain"]
    Interactor --> Env["DOM · React · Vue · Browser"]
    Locator -. "locatorUtil.toCssSelector()" .-> Interactor
```

A driver never touches the environment directly — it delegates every action to its injected `Interactor`, passing a `PartLocator`. The interactor resolves the locator to a runtime CSS selector via `locatorUtil.toCssSelector(locator, this)` and acts on it ([ComponentDriver.ts#L138-L251](../packages/core/src/drivers/ComponentDriver.ts#L138-L251), [DOMInteractor.ts#L379-L391](../packages/dom-core/src/DOMInteractor.ts#L379-L391)).

### Part tree construction

When a driver is constructed, `getPartFromDefinition` walks its `ScenePart` and instantiates a child driver per entry, chaining each child's locator onto the parent's ([driverUtil.ts](../packages/core/src/drivers/driverUtil.ts#L7-L48)):

1. `locatorContext = driver.prototype.overriddenParentLocator() ?? parentLocator` — lets portal components escape their parent.
2. `actualLocator = overrideLocatorRelativePosition()` applied if the driver overrides it.
3. `componentLocator = locatorUtil.append(locatorContext, actualLocator)`.
4. `new DriverCtor(componentLocator, interactor, option)`.

This is eager and synchronous: the entire driver tree exists after `createTestEngine` returns.

## Interactor inheritance

```mermaid
flowchart TD
    I["interface Interactor"]
    DOM["DOMInteractor<br/>(@testing-library/dom + user-event + FakeMouseEvent)"]
    React["ReactInteractor<br/>wraps each method in act()"]
    Vue["VueInteractor<br/>awaits nextTick() after each method"]
    PW["PlaywrightInteractor<br/>page.locator(css).&lt;action&gt;()"]
    I -. implements .-> DOM
    I -. implements .-> PW
    DOM --> React
    DOM --> Vue
```

- **`DOMInteractor`** implements `Interactor` over `@testing-library/dom`'s `fireEvent`, `@testing-library/user-event`, and a `FakeMouseEvent` polyfill (testing-library drops `pageX/pageY`). `getElement` runs `rootEl.querySelector(All)` on the resolved selector ([DOMInteractor.ts#L32-L391](../packages/dom-core/src/DOMInteractor.ts#L32-L391)).
- **`ReactInteractor extends DOMInteractor`** and `override`s every interactive method to wrap `super.*` in `act(async () => …)`, flushing React state updates ([ReactInteractor.ts](../packages/react-core/src/ReactInteractor.ts#L22-L127)).
- **`VueInteractor extends DOMInteractor`** and `override`s each method to call `super.*` then `await nextTick()`, flushing Vue reactivity ([VueInteractor.ts](../packages/vue-3/src/VueInteractor.ts#L22-L114)).
- **`PlaywrightInteractor implements Interactor` directly** — it does **not** extend `DOMInteractor`. Every method resolves the locator to CSS and calls `page.locator(css).<action>()`; Playwright handles waiting/retrying natively, so there is no `act()`/`nextTick()` ([PlaywrightInteractor.ts](../packages/playwright/src/PlaywrightInteractor.ts#L31-L324)). See [ADR-002](adr/002-interactor-abstraction.md).

Key behavior differences to remember:
- React/Vue interactors `clone()` to their own subclass (`new ReactInteractor(this.rootEl)`); the base `rootEl` is `protected` ([DOMInteractor.ts#L33](../packages/dom-core/src/DOMInteractor.ts#L33), [ReactInteractor.ts#L124-L126](../packages/react-core/src/ReactInteractor.ts#L124-L126)).
- `PlaywrightInteractor.isVisible` wraps style reads in try/catch to tolerate elements detaching mid-animation ([PlaywrightInteractor.ts#L259-L297](../packages/playwright/src/PlaywrightInteractor.ts#L259-L297)); `DOMInteractor.isVisible` does not ([DOMInteractor.ts#L456-L478](../packages/dom-core/src/DOMInteractor.ts#L456-L478)).

## createTestEngine variants — what actually differs

| Aspect | react-18 / react-19 | react-legacy | vue-3 |
|--------|---------------------|--------------|-------|
| Render API | `createRoot(container).render(node)` in `act()` | `ReactDOM.render(node, container)` in `act()` | `@testing-library/vue` `render()`, falls back to `createApp().mount()` |
| `act` source | `@testing-library/react` | `react-dom/test-utils` | n/a (uses `nextTick`) |
| Unmount | `root.unmount()` in `act()` | `ReactDOM.unmountComponentAtNode` | `renderResult.unmount()` / `app.unmount()` |
| Root marker attribute | `data-atomic-testing-react` | `data-atomic-testing-react-legacy` | `data-atomic-testing-vue` |
| Input node type | `ReactNode` | `ReactElement` | `Component \| VueSFCLikeComponent` |

`react-18` and `react-19` are byte-for-byte equivalent in implementation (both target the `createRoot` API); they exist as separate packages only to pin different React peer ranges. See [ADR-003](adr/003-version-specific-packages.md). Option types `IReactTestEngineOption` / `IVueTestEngineOption` both add an optional `rootElement` mount target ([react-18/types.ts](../packages/react-18/src/types.ts#L3), [vue-3/types.ts](../packages/vue-3/src/types.ts#L3)).

## Package dependency graph

```mermaid
flowchart TD
    core["core"]
    domcore["dom-core"]
    reactcore["react-core"]
    r18["react-18"]
    r19["react-19"]
    rlegacy["react-legacy"]
    vue["vue-3"]
    pw["playwright"]
    itr["internal-test-runner"]
    jest["…-jest-adapter"]
    vitest["…-vitest-adapter"]
    html["component-driver-html"]
    mui["component-driver-mui-v5/6/7"]
    muix["component-driver-mui-x-v5..v8"]

    core --> domcore
    domcore --> reactcore
    reactcore --> r18
    reactcore --> r19
    reactcore --> rlegacy
    core --> vue
    domcore --> vue
    core --> pw
    itr --> pw
    core --> itr
    itr --> jest
    itr --> vitest
    core --> html
    html --> mui
    domcore --> mui
    r18 --> mui
    html --> muix
    mui --> muix
```

Edges are "depends on" (arrow points from dependency to dependent). Notable real edges from `package.json`:
- `component-driver-mui-v7` depends on `react-18` (and `@mui/material@^7`, `component-driver-html`, `core`, `dom-core`) ([mui-v7/package.json#L25-L33](../packages/component-driver-mui-v7/package.json#L25-L33)).
- `component-driver-mui-x-v8` depends on `component-driver-mui-v6` (plus `component-driver-html`, `core`) ([mui-x-v8/package.json#L40-L45](../packages/component-driver-mui-x-v8/package.json#L40-L45)). [inferred] other mui-x versions pair with their contemporaneous mui-v* package — confirm in each `package.json`.
- `playwright` depends on `internal-test-runner` and `core` only; `@playwright/test` is a peer ([playwright/package.json#L31-L37](../packages/playwright/package.json#L31-L37)).

## The shared three-file test pattern

One test suite runs unchanged in Jest (jsdom), Vitest, and Playwright. This is the project's signature pattern (see [ADR-004](adr/004-shared-three-file-test-pattern.md)).

```mermaid
flowchart LR
    suite["*.suite.ts<br/>TestSuiteInfo: title, url, tests(getTestEngine, mapper)"]
    suite --> dom["*.dom.test.ts<br/>testRunner(suite, jestTestAdapter, { getTestEngine: react createTestEngine })"]
    suite --> e2e["*.e2e.test.ts<br/>testRunner(suite, playWrightTestFrameworkMapper, getTestRunnerInterface())"]
    dom --> jestmap["jestTestAdapter / vitestAdapter"]
    e2e --> pwmap["playWrightTestFrameworkMapper"]
    jestmap --> react["ReactInteractor → DOM"]
    pwmap --> pwi["PlaywrightInteractor → Browser"]
```

Mechanism:
- **`TestSuiteInfo<T>`** = `{ title?, url, tests(getTestEngine, mapper) }` ([types.ts#L114-L121](../packages/internal-test-runner/src/types.ts#L114-L121)). `url` is where the E2E runner navigates in `beforeEach`; DOM runs ignore it.
- **`testRunner(suite|suites, mapper, interactionInterface)`** wraps each suite in `mapper.describe`, installs a `beforeEach` that detects Jest's done-callback vs Playwright's fixture by inspecting `arguments[0]`, and calls `goto(url)` for E2E interfaces before invoking `suite.tests(getTestEngine, mapper)` ([testRunner.ts](../packages/internal-test-runner/src/testRunner.ts#L7-L50)).
- **`TestFrameworkMapper`** normalizes assertions + lifecycle across runners: `assertEqual/assertNotEqual/assertTrue/assertFalse/assertApproxEqual`, `describe/test/it`, `beforeEach/afterEach/beforeAll/afterAll` ([types.ts#L72-L88](../packages/internal-test-runner/src/types.ts#L72-L88)). Adapters: `jestTestAdapter` (`@jest/globals`), `vitestAdapter` (`vitest`), `playWrightTestFrameworkMapper` (`@playwright/test`).
- **`useTestEngine(scenePart, getTestEngine, { beforeEach, afterEach })`** builds the engine in `beforeEach` (passing `{ page }` for E2E) and calls `cleanUp()` in `afterEach`; returns a getter `engine()` ([useTestEngine.ts](../packages/internal-test-runner/src/useTestEngine.ts#L21-L46)).

See [modules/test-runner.md](modules/test-runner.md) for the worked three-file example and the `CLAUDE.md` quickstart.

## Cross-cutting concerns

- **Reactivity sync** — handled per-environment by the interactor (`act()` / `nextTick()` / Playwright auto-wait), so test code stays identical. See interactor inheritance above.
- **Waiting / timing** — two tools: `waitUntilComponentState` (state-based, throws on timeout) and `waitUntil` (probe-based, returns last value). Probe interval = `timeoutMs / probeCount` (default 10 probes) ([timingUtil.ts#L42-L81](../packages/core/src/utils/timingUtil.ts#L42-L81)).
- **Portal / overlay components** — modeled with `overriddenParentLocator()` + `overrideLocatorRelativePosition()` returning a `Root` locator, e.g. `byRole('presentation', 'Root')` in `MenuDriver`/`DialogDriver` ([MenuDriver.ts#L24-L41](../packages/component-driver-mui-v7/src/components/MenuDriver.ts#L24-L41), [DialogDriver.ts#L25-L44](../packages/component-driver-mui-v7/src/components/DialogDriver.ts#L25-L44)).
- **Error reporting** — failures throw typed errors carrying the locator or driver (see [DOMAIN.md → Failure modes](DOMAIN.md#failure-modes-error-catalog)); `driverName` identifies the offending driver.

## Key design decisions

| Decision | Rationale | ADR |
|----------|-----------|-----|
| Semantic component-driver API over raw queries | Tests read in domain terms; selectors live in one place | [ADR-001](adr/001-component-driver-pattern.md) |
| `Interactor` abstraction | One driver runs across DOM/React/Vue/Playwright | [ADR-002](adr/002-interactor-abstraction.md) |
| Version-specific packages (mui-v5/6/7, react-18/19/legacy) | Isolate framework-major DOM/API differences from consumers | [ADR-003](adr/003-version-specific-packages.md) |
| Shared `*.suite.ts` + `TestFrameworkMapper` | Author once, run in Jest/Vitest/Playwright | [ADR-004](adr/004-shared-three-file-test-pattern.md) |
