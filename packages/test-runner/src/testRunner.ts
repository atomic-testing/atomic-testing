import { ScenePart } from '@atomic-testing/core';

import { E2eTestRunEnvironmentFixture, InteractionInterface, TestFrameworkMapper, TestSuiteInfo } from './types';

export const emptyGoto = (_url: string) => {};

export function testRunner<T extends ScenePart>(
  testSuiteInfo: TestSuiteInfo<T> | TestSuiteInfo<T>[],
  testMethod: TestFrameworkMapper,
  interactionInterface: InteractionInterface<T>,
) {
  const suites: TestSuiteInfo<T>[] = Array.isArray(testSuiteInfo) ? testSuiteInfo : [testSuiteInfo];
  const { getTestEngine } = interactionInterface;
  suites.forEach((suite) => {
    const { title, tests, url } = suite;
    testMethod.describe(title ?? '', () => {
      // @ts-ignore
      testMethod.beforeEach(function ({ page: _page }) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        let done: Function | undefined = undefined;
        let parameters: E2eTestRunEnvironmentFixture | undefined = undefined;

        const passIn = arguments[0];
        if (typeof passIn === 'function') {
          done = passIn;
        } else {
          parameters = passIn;
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
