import { ScenePart } from '@atomic-testing/core';

import { E2eTestRunEnvironmentFixture, InteractionInterface, TestFrameworkMapper, TestSuiteInfo } from './types';

export const emptyGoto = (_url: string) => {};

export function testRunner<T extends ScenePart>(
  testSuiteInfo: TestSuiteInfo<T> | TestSuiteInfo<T>[],
  testMethod: TestFrameworkMapper,
  interactionInterface: InteractionInterface<T>
) {
  const suites: TestSuiteInfo<T>[] = Array.isArray(testSuiteInfo) ? testSuiteInfo : [testSuiteInfo];
  const { getTestEngine } = interactionInterface;
  suites.forEach(suite => {
    const { title, tests, url } = suite;
    testMethod.describe(title ?? '', () => {
      // INTENTIONAL @ts-ignore: This function supports both Jest and Playwright callback signatures.
      // Jest uses a done callback: (done?: DoneCallback) => void
      // Playwright uses fixture destructuring: ({ page, browser }) => Promise<void>
      // These signatures are fundamentally incompatible, so we use @ts-ignore and handle
      // both cases at runtime by inspecting the arguments object.
      // @ts-ignore
      testMethod.beforeEach(function ({ page: _page }) {
        let done: (() => void) | undefined = undefined;
        let parameters: E2eTestRunEnvironmentFixture | undefined = undefined;

        const passIn = arguments[0];
        if (typeof passIn === 'function') {
          done = passIn as () => void;
        } else {
          parameters = passIn as E2eTestRunEnvironmentFixture;
        }

        if ('goto' in interactionInterface) {
          const cb = interactionInterface.goto(url, parameters);
          if (cb instanceof Promise) {
            return cb.finally(() => {
              done?.();
            });
          } else {
            return done?.();
          }
        }
        return done?.();
      });

      tests(getTestEngine, testMethod);
    });
  });
}
