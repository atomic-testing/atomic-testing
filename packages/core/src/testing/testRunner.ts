import { ScenePart } from '../types';
import { E2eTestRunEnvironmentFixture, Goto, InteractionInterface, TestFrameworkMapper, TestSuiteInfo } from './types';

export const emptyGoto: Goto = () => {};

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
      testMethod.beforeEach(function ({ page }) {
        let done: Function | undefined = undefined;
        let parameters: E2eTestRunEnvironmentFixture | undefined = undefined;
        // eslint-disable-next-line prefer-rest-params
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
