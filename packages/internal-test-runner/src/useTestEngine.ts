import { ScenePart, TestEngine } from '@atomic-testing/core';

import { GetTestEngine, TestFrameworkMapper } from './types';

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

  // @ts-ignore - Jest uses done callback, Playwright uses fixture destructuring
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
