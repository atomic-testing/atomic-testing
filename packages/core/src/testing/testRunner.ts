import { ScenePart } from '../types';
import { GetTestEngine, TestInterface, TestSuiteInfo } from './testRunnerAdapter';

export function testRunner<T extends ScenePart>(
  testSuiteInfo: TestSuiteInfo<T> | TestSuiteInfo<T>[],
  testInterface: TestInterface,
  e2eTestEngineCreate?: GetTestEngine<T>,
) {
  const suites: TestSuiteInfo<T>[] = Array.isArray(testSuiteInfo) ? testSuiteInfo : [testSuiteInfo];
  suites.forEach((suite) => {
    const { title, url, domTestEngine, tests } = suite;
    testInterface.describe(title ?? '', () => {
      if (domTestEngine == null && e2eTestEngineCreate == null) {
        throw new Error('No test engine provided, please provide a domTestEngine or e2eTestEngineCreate');
      }

      // @ts-ignore
      testInterface.beforeEach(function (context) {
        let done: Function | undefined = undefined;
        let parameters: any = undefined;
        if (typeof context === 'function') {
          done = context;
        } else {
          parameters = context;
        }
        if (url) {
          // @ts-ignore
          const cb = testInterface.goto(url, parameters);
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

      tests((e2eTestEngineCreate ?? domTestEngine)!, testInterface);
    });
  });
}
