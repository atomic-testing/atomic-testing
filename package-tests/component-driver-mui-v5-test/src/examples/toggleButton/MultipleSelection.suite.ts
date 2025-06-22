import { ToggleButtonGroupDriver } from '@atomic-testing/component-driver-mui-v5';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';

import { regularSelectionUIExample } from './MultipleSelection.example';

export const regularSelectionExampleScenePart = {
  formatting: {
    locator: byDataTestId('formatting'),
    driver: ToggleButtonGroupDriver,
  },
} satisfies ScenePart;

export const regularSelectionExample: IExampleUnit<typeof regularSelectionExampleScenePart, JSX.Element> = {
  ...regularSelectionUIExample,
  scene: regularSelectionExampleScenePart,
};

export const regularSelectionButtonTestSuite: TestSuiteInfo<typeof regularSelectionExampleScenePart> = {
  title: 'Multiple Selection',
  url: '/toggle-button',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof regularSelectionExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(regularSelectionExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Initially there should be no selected value', async () => {
      const value = await testEngine.parts.formatting.getValue();
      assertEqual(value, []);
    });

    test('Selecting a value should update the value', async () => {
      await testEngine.parts.formatting.setValue(['bold', 'italic']);
      const value = await testEngine.parts.formatting.getValue();
      assertEqual(value, ['bold', 'italic']);
    });
  },
};
