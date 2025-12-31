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
    testEngine = getTestEngine(scenePart, { page });
    if (typeof arguments[0] === 'function') {
      (arguments[0] as () => void)();
    }
  });

  hooks.afterEach(async () => {
    await testEngine.cleanUp();
  });

  return () => testEngine;
}
