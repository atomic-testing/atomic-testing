import { HTMLElementDriver, HTMLSelectDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

export const SingleSelectExample = () => {
  return (
    <form>
      <label htmlFor="value-input" data-testid="input-label">
        Input
      </label>
      <input type="text" value="Something" id="value-input" />
    </form>
  );
};

export const singleSelectExampleScenePart = {
  select: {
    locator: byDataTestId('input-label'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const singleSelectExample: IExampleUnit<typeof singleSelectExampleScenePart, JSX.Element> = {
  title: 'Single Select',
  scene: singleSelectExampleScenePart,
  ui: <SingleSelectExample />,
};

export const singleSelectTestSuite: TestSuiteInfo<typeof singleSelectExample.scene> = {
  title: 'Single Select',
  url: '/select',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${singleSelectExample.title}`, () => {
      let testEngine: TestEngine<typeof singleSelectExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(singleSelectExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Single Select', async () => {
        const targetValue = '3';
        await testEngine.parts.select.setValue(targetValue);
        const val = await testEngine.parts.select.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
