# Module group: test runner

Covers the suite-orchestration layer that makes one test suite run in Jest, Vitest, and Playwright, plus the demo app used by suites/docs:

| Package | Provides |
|---------|----------|
| `@atomic-testing/internal-test-runner` | `testRunner`, `useTestEngine`, `TestFrameworkMapper`, `TestSuiteInfo`, interface types |
| `@atomic-testing/internal-test-runner-jest-adapter` | `jestTestAdapter` |
| `@atomic-testing/internal-test-runner-vitest-adapter` | `vitestAdapter` |
| `@atomic-testing/internal-react-example` | `ExampleApp`, `ExampleList` — demo harness |

> `internal-*` packages are workspace-private dev tooling (not published consumer API). The Playwright mapper (`playWrightTestFrameworkMapper`) lives in `@atomic-testing/playwright` — see [modules/playwright.md](playwright.md).

## Purpose

Define a framework-neutral way to describe a test suite (`TestSuiteInfo`), a normalized assertion/lifecycle surface (`TestFrameworkMapper`), and a driver (`testRunner`) that wires a suite to a concrete runner + interaction interface.

## Public surface

Barrel: [internal-test-runner/src/index.ts](../../packages/internal-test-runner/src/index.ts).

| Export | Kind | File |
|--------|------|------|
| `testRunner(suite \| suites, mapper, interactionInterface)` | function | [testRunner.ts#L7](../../packages/internal-test-runner/src/testRunner.ts#L7) |
| `useTestEngine(scenePart, getTestEngine, { beforeEach, afterEach })` | function | [useTestEngine.ts#L21](../../packages/internal-test-runner/src/useTestEngine.ts#L21) |
| `TestSuiteInfo<T>` | type | [types.ts#L114](../../packages/internal-test-runner/src/types.ts#L114) |
| `TestFrameworkMapper` | type | [types.ts#L72](../../packages/internal-test-runner/src/types.ts#L72) |
| `GetTestEngine<T>`, `InteractionInterface<T>`, `E2eTestInterface<T>`, `E2eTestRunEnvironmentFixture`, `TestFixture` | types | [types.ts](../../packages/internal-test-runner/src/types.ts) |
| `emptyGoto` | const | [testRunner.ts#L5](../../packages/internal-test-runner/src/testRunner.ts#L5) |
| `jestTestAdapter` | `TestFrameworkMapper` | [jest-adapter/index.ts#L13](../../packages/internal-test-runner-jest-adapter/src/index.ts#L13) |
| `vitestAdapter` | `TestFrameworkMapper` | [vitest-adapter/index.ts#L10](../../packages/internal-test-runner-vitest-adapter/src/index.ts#L10) |
| `ExampleApp`, `ExampleList`, `ExampleToc`, `AppProps` | React components/types | [internal-react-example/src/index.ts](../../packages/internal-react-example/src/index.ts) |

## Key types

- **`TestSuiteInfo<T>`** = `{ title?, url, tests(getTestEngine, mapper) }`. `url` is the E2E navigation target; DOM runs ignore it ([types.ts#L114-L121](../../packages/internal-test-runner/src/types.ts#L114-L121)).
- **`TestFrameworkMapper`** — assertions (`assertEqual`, `assertNotEqual`, `assertTrue`, `assertFalse`, `assertApproxEqual`) + lifecycle (`describe`, `test`, `it`, `beforeEach`, `afterEach`, `beforeAll`, `afterAll`). `describe`/`test`/`it` carry `.only`/`.skip` ([types.ts#L53-L88](../../packages/internal-test-runner/src/types.ts#L53-L88)).
- **`GetTestEngine<T>`** = `(scenePart, context?) => TestEngine<T>` — supplied by each adapter (`context` carries `{ page }` for E2E).
- **`InteractionInterface<T>`** = `DomTestInterface<T> | E2eTestInterface<T>`; the E2E variant adds `goto(url, fixture?)`.

## How it works

`testRunner(testSuiteInfo, testMethod, interactionInterface)` ([testRunner.ts#L7-L50](../../packages/internal-test-runner/src/testRunner.ts#L7-L50)):

1. Normalizes to an array of suites.
2. For each suite: `testMethod.describe(title, …)`.
3. Installs a `beforeEach` that reads `arguments[0]` to tell Jest's done-callback from Playwright's fixture, then — if the interface has `goto` (E2E) — navigates to `url` before signalling done.
4. Calls `suite.tests(getTestEngine, testMethod)`, where the suite author writes the actual `test(...)` cases.

`useTestEngine(scenePart, getTestEngine, { beforeEach, afterEach })` ([useTestEngine.ts#L21-L46](../../packages/internal-test-runner/src/useTestEngine.ts#L21-L46)):
- `beforeEach`: `testEngine = getTestEngine(scenePart, { page })` (page is `undefined` for DOM).
- `afterEach`: `await testEngine.cleanUp()`.
- Returns a getter `() => testEngine`; tests call `engine()` to read the current instance.

### Adapters

| Adapter | Backs assertions/lifecycle with | `@ts` notes |
|---------|---------------------------------|-------------|
| `jestTestAdapter` | `@jest/globals` `expect`/`describe`/`test`/hooks | `@ts-ignore` on `describe`/`test`/`it` (signature mismatch) ([jest-adapter/index.ts](../../packages/internal-test-runner-jest-adapter/src/index.ts)) |
| `vitestAdapter` | `vitest` `expect`/`describe`/`test`/hooks | none needed — Vitest 4 aligns ([vitest-adapter/index.ts](../../packages/internal-test-runner-vitest-adapter/src/index.ts)) |
| `playWrightTestFrameworkMapper` | `@playwright/test` | `@ts-expect-error` (fixture-callback mismatch); in the playwright package |

All three implement `assertApproxEqual` as `expect(Math.abs(actual-expected)).toBeLessThanOrEqual(tolerance)`.

### Demo harness (`internal-react-example`)

`ExampleApp` is a `react-router-dom` layout (200px nav + content `<Outlet>`) that routes a list of `ExampleToc` (`{ label, path, ui }`) entries; `ExampleList` renders an array of `IExampleUIUnit` examples ([ExampleApp.tsx](../../packages/internal-react-example/src/ExampleApp.tsx#L34-L72)). It hosts the components that `package-tests` E2E suites navigate to via `url`.

## Worked example (three-file pattern)

Suite (`*.suite.ts`):
```ts
export const scenePart = { input: { locator: byDataTestId('input'), driver: HTMLTextInputDriver } } satisfies ScenePart;
export const testSuite: TestSuiteInfo<typeof scenePart> = {
  title: 'MyComponent', url: '/my-component',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe('MyComponent', () => {
      const engine = useTestEngine(scenePart, getTestEngine, { beforeEach, afterEach });
      test('sets value', async () => {
        await engine().parts.input.setValue('test');
        assertEqual(await engine().parts.input.getValue(), 'test');
      });
    });
  },
};
```
DOM adapter (`*.dom.test.ts`): `testRunner(testSuite, jestTestAdapter, { getTestEngine: (p) => createTestEngine(<MyComponent/>, p) })`.
E2E adapter (`*.e2e.test.ts`): `testRunner(testSuite, playWrightTestFrameworkMapper, getTestRunnerInterface())`.

(See `CLAUDE.md` for the canonical version of this pattern.)

## Invariants & failure modes

- A new engine is created per test; `cleanUp` runs in `afterEach`. Sharing engines across tests is unsupported.
- `beforeEach` runtime dispatch relies on `arguments[0]` being a function (Jest) vs object (Playwright fixture) — do not refactor those callbacks to arrow functions without preserving `arguments`.

## Extension points

- **Support another runner** → implement a `TestFrameworkMapper` mapping its `expect`/lifecycle (copy `vitestAdapter`).
- **Add an assertion** → extend `TestFrameworkMapper` in `types.ts` and implement it in every adapter (jest, vitest, playwright).

## Related files

- [../ARCHITECTURE.md](../ARCHITECTURE.md#the-shared-three-file-test-pattern) — diagram of the flow.
- [adr/004-shared-three-file-test-pattern.md](../adr/004-shared-three-file-test-pattern.md) — rationale.
- [modules/playwright.md](playwright.md) — the E2E mapper + interface.
