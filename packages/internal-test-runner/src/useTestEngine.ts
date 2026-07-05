import { ScenePart, TestEngine } from '@atomic-testing/core';

import { getDoneCallback } from './doneCallback';
import { GetTestEngine, TestFixture, TestFrameworkMapper } from './types';

/**
 * A helper that manages TestEngine lifecycle in beforeEach/afterEach.
 * Returns a getter function that retrieves the current TestEngine instance.
 *
 * @example
 * ```typescript
 * tests: (getTestEngine, { beforeEach, afterEach, test, assertEqual }) => {
 *   const engine = useTestEngine(scenePart, getTestEngine, { beforeEach, afterEach });
 *
 *   test('example', async () => {
 *     await engine().parts.input.setValue('test');
 *     assertEqual(await engine().parts.input.getValue(), 'test');
 *   });
 * }
 * ```
 */
export function useTestEngine<T extends ScenePart>(
  scenePart: T,
  getTestEngine: GetTestEngine<T>,
  hooks: Pick<TestFrameworkMapper, 'beforeEach' | 'afterEach'>
): () => TestEngine<T> {
  let testEngine: TestEngine<T>;

  // INTENTIONAL @ts-ignore: This function supports the Jest, Playwright and Vitest
  // callback signatures.
  // Jest uses a done callback: (done?: DoneCallback) => void
  // Playwright uses fixture destructuring: ({ page, browser }) => Promise<void>
  // Vitest passes a (callable) TestContext object.
  // These signatures are fundamentally incompatible, so we use @ts-ignore and handle
  // all cases at runtime by inspecting the arguments object.
  // @ts-ignore
  hooks.beforeEach(function ({ page }: TestFixture) {
    const done = getDoneCallback(arguments[0]);
    const engineOrPromise = getTestEngine(scenePart, { page });
    // Async factories (e.g. the Angular adapter, whose bootstrap is inherently
    // async) resolve before the first test runs. The promise is only returned
    // to promise-aware runners (Vitest/Playwright); done-callback runners
    // (Jest) signal completion through `done` instead, because a hook may not
    // both take a done callback and return a promise. Thenable duck-typing
    // (not `instanceof Promise`): zone.js swaps the global Promise for
    // ZoneAwarePromise, so a native promise fails the instanceof check there.
    if (typeof (engineOrPromise as Promise<TestEngine<T>>)?.then === 'function') {
      const resolved = (engineOrPromise as Promise<TestEngine<T>>).then(engine => {
        testEngine = engine;
        done?.();
      });
      return done == null ? resolved : undefined;
    }
    testEngine = engineOrPromise as TestEngine<T>;
    done?.();
  });

  hooks.afterEach(async () => {
    await testEngine.cleanUp();
  });

  return () => testEngine;
}
