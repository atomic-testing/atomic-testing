import { ScenePart, TestEngine } from '@atomic-testing/core';

/**
 * Simple assert equal function
 */
export type AssertEqual = (actual: unknown, expected: unknown) => void;

/**
 * Assert not equal function
 */
export type AssertNotEqual = (actual: unknown, expected: unknown) => void;

/**
 * Assert true function
 */
export type AssertTrue = (value: unknown) => void;

/**
 * Assert false function
 */
export type AssertFalse = (value: unknown) => void;

/**
 * Assert approximate equality for numbers with tolerance
 */
export type AssertApproxEqual = (actual: number, expected: number, tolerance: number) => void;

export type EmptyFunction = () => void;

/**
 * Done callback used in test runners such as Jest
 */
export type DoneCallback = () => void;

/**
 * Fixture object passed to test runner, used in test runner such as Playwright
 */
export type E2eTestRunEnvironmentFixture = { page: unknown; browser: unknown };

/**
 * Partial fixture type for use in test callbacks that need to access page.
 * The page property is optional to support both DOM tests (no page) and E2E tests (with page).
 * Use this type to avoid @ts-ignore when destructuring { page } in beforeEach callbacks.
 */
export type TestFixture = { page?: unknown };

type ProviderCallbackParameter = DoneCallback | E2eTestRunEnvironmentFixture;

type ProvidesCallback =
  | ((parameter?: ProviderCallbackParameter) => void | undefined)
  | ((parameter?: ProviderCallbackParameter) => Promise<unknown>);

interface Describe {
  (name: string, fn: EmptyFunction): void;
  only: Describe;
  skip: Describe;
}

interface LifeCycleHook {
  (fn: ProvidesCallback): any;
}

interface Test {
  (name: string, fn?: ProvidesCallback): void;
  only: Test;
  skip: Test;
}

/**
 * Mapping aiming to normalize the differences of test runners such as Jest, Mocha, Jasmine, etc.
 */
export interface TestFrameworkMapper {
  assertEqual: AssertEqual;
  assertNotEqual: AssertNotEqual;
  assertTrue: AssertTrue;
  assertFalse: AssertFalse;
  assertApproxEqual: AssertApproxEqual;

  describe: Describe;

  beforeEach: LifeCycleHook;
  afterEach: LifeCycleHook;
  beforeAll: LifeCycleHook;
  afterAll: LifeCycleHook;

  test: Test;
  it: Test;
}

export type GetTestEngine<T extends ScenePart> = (scenePart: T, context?: any) => TestEngine<T>;

/**
 * Interface for Dom tests which don't involve navigating to a URL
 */
export type DomTestInterface<T extends ScenePart> = {
  getTestEngine: GetTestEngine<T>;
};

type GotoReturn = any;

/**
 * Interface for E2e tests which involve navigating to a URL
 */
export type E2eTestInterface<T extends ScenePart> = {
  getTestEngine: GetTestEngine<T>;

  goto(url: string): GotoReturn;
  goto(url: string, context: E2eTestRunEnvironmentFixture): GotoReturn;
  goto(url: string, context?: E2eTestRunEnvironmentFixture): GotoReturn;
};

export type InteractionInterface<T extends ScenePart> = DomTestInterface<T> | E2eTestInterface<T>;

export interface TestSuiteInfo<T extends ScenePart> {
  title?: string;
  /**
   * URL to visit before running each when executing e2e tests
   */
  url: string;
  tests: (getTestEngine: GetTestEngine<T>, testInterface: TestFrameworkMapper) => void;
}
