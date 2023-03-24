import { TestEngine } from '..';
import { ScenePart } from '../types';

/**
 * Simple assert equal function
 */
export type AssertEqual = (actual: unknown, expected: unknown) => void;

export type EmptyFunction = () => void;

// TODO: Investigate cb:DoneCallback support across all test frameworks
type ProvidesCallback = (() => void | undefined) | (() => Promise<unknown>);

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

  // TODO: Investigate support of each, todo, failing
}

interface Goto {
  (url: string): Promise<void> | any;
}

export interface TestInterface {
  assertEqual: AssertEqual;

  describe: Describe;

  beforeEach: LifeCycleHook;
  afterEach: LifeCycleHook;
  beforeAll: LifeCycleHook;
  afterAll: LifeCycleHook;

  test: Test;
  it: Test;

  // TODO: Provide richer Jest/Chai-like assertion API

  goto: Goto;
  visit: Goto;
}

export interface TestSuiteInfo<T extends ScenePart> {
  title?: string;

  /**
   * URL to visit before running each when executing e2e tests
   */
  url?: string;

  /**
   * TestEngine to instantiate for DOM tests
   * @returns TestEngine instance
   */
  domTestEngine?: () => TestEngine<T>;

  tests: (getTestEngine: () => TestEngine<T>, testInterface: TestInterface) => void;
}
