import { ExclusiveToggleButtonGroupDriver } from '@atomic-testing/component-driver-mui-v5';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

import { exclusiveSelectionUIExample } from './ExclusiveSelection.example';

export const exclusiveSelectionExampleScenePart = {
  alignment: {
    locator: byDataTestId('alignment'),
    driver: ExclusiveToggleButtonGroupDriver,
  },
} satisfies ScenePart;

export const exclusiveSelectionExample: IExampleUnit<typeof exclusiveSelectionExampleScenePart, JSX.Element> = {
  ...exclusiveSelectionUIExample,
  scene: exclusiveSelectionExampleScenePart,
};

export const exclusiveSelectionTestSuite: TestSuiteInfo<typeof exclusiveSelectionExampleScenePart> = {
  title: 'Exclusive Selection',
  url: '/toggle-button',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof exclusiveSelectionExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(exclusiveSelectionExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Initially there should be no selected value', async () => {
      const value = await testEngine.parts.alignment.getValue();
      assertEqual(value, null);
    });

    test('Selecting a value should update the value', async () => {
      await testEngine.parts.alignment.setValue('center');
      const value = await testEngine.parts.alignment.getValue();
      assertEqual(value, 'center');
    });
  },
};
