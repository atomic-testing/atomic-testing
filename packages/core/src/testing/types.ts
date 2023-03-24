import { TestEngine } from '..';
import { ScenePart } from '../types';

/**
 * Simple assert equal function
 */
export type AssertEqual = (actual: unknown, expected: unknown) => void;

export type EmptyFunction = () => void;

/**
 * Done callback used in test runners such as Jest
 */
export type DoneCallback = () => void;

/**
 * Fixture object passed to test runner, used in test runner such as Playwright
 */
export type E2eTestRunEnvironmentFixture = { page: unknown; browser: unknown };

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

export interface Goto {
  (url: string, context?: E2eTestRunEnvironmentFixture): Promise<void> | any;
}

/**
 * Mapping aiming to normalize the differences of test runners such as Jest, Mocha, Jasmine, etc.
 */
export interface TestFrameworkMapper {
  assertEqual: AssertEqual;

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
export interface DomTestInterface<T extends ScenePart> {
  getTestEngine: GetTestEngine<T>;
}

/**
 * Interface for E2e tests which involve navigating to a URL
 */
export interface E2eTestInterface<T extends ScenePart> {
  getTestEngine: GetTestEngine<T>;
  goto: Goto;
}

export type InteractionInterface<T extends ScenePart> = DomTestInterface<T> | E2eTestInterface<T>;

export interface TestSuiteInfo<T extends ScenePart> {
  title?: string;
  /**
   * URL to visit before running each when executing e2e tests
   */
  url: string;
  tests: (getTestEngine: GetTestEngine<T>, testInterface: TestFrameworkMapper) => void;
}
