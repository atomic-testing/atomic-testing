import { TestEngine } from '../TestEngine';
import { ScenePart } from '../types';
import { TestInterface, TestSuiteInfo } from './testRunnerAdapter';

export function testRunner<T extends ScenePart>(
  testSuiteInfo: TestSuiteInfo<T> | TestSuiteInfo<T>[],
  testInterface: TestInterface,
  e2eTestEngineCreate?: () => TestEngine<T>,
) {
  const suites: TestSuiteInfo<T>[] = Array.isArray(testSuiteInfo) ? testSuiteInfo : [testSuiteInfo];
  suites.forEach((suite) => {
    const { title, url, domTestEngine, tests } = suite;
    testInterface.describe(title ?? '', () => {
      if (domTestEngine == null && e2eTestEngineCreate == null) {
        throw new Error('No test engine provided, please provide a domTestEngine or e2eTestEngineCreate');
      }

      if (url) {
        testInterface.beforeEach(() => {
          return testInterface.goto(url);
        });
      }

      const getTestEngine = domTestEngine ?? e2eTestEngineCreate;
      tests(getTestEngine!, testInterface);
    });
  });
}
