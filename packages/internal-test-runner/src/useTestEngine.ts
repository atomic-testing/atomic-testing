import { ScenePart, TestEngine } from '@atomic-testing/core';

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

  // INTENTIONAL @ts-ignore: This function supports both Jest and Playwright callback signatures.
  // Jest uses a done callback: (done?: DoneCallback) => void
  // Playwright uses fixture destructuring: ({ page, browser }) => Promise<void>
  // These signatures are fundamentally incompatible, so we use @ts-ignore and handle
  // both cases at runtime by inspecting the arguments object.
  // @ts-ignore
  hooks.beforeEach(function ({ page }: TestFixture) {
    const done = typeof arguments[0] === 'function' ? (arguments[0] as () => void) : undefined;
    const engineOrPromise = getTestEngine(scenePart, { page });
    // Async factories (e.g. the Angular adapter, whose bootstrap is inherently
    // async) resolve before the first test runs. The promise is only returned
    // to promise-aware runners (Vitest/Playwright); done-callback runners
    // (Jest) signal completion through `done` instead, because a hook may not
    // both take a done callback and return a promise.
    if (engineOrPromise instanceof Promise) {
      const resolved = engineOrPromise.then(engine => {
        testEngine = engine;
        done?.();
      });
      return done == null ? resolved : undefined;
    }
    testEngine = engineOrPromise;
    done?.();
  });

  hooks.afterEach(async () => {
    await testEngine.cleanUp();
  });

  return () => testEngine;
}
