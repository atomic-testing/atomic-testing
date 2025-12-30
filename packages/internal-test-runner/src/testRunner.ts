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
      // Note: Playwright requires destructuring syntax ({ page }) for fixtures.
      // The @ts-ignore is needed because the callback signature differs between Jest and Playwright.
      // @ts-ignore - Jest uses done callback, Playwright uses fixture destructuring
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
