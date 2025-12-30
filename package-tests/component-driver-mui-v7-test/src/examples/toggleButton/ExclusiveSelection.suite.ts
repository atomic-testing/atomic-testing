import { ExclusiveToggleButtonGroupDriver } from '@atomic-testing/component-driver-mui-v7';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(exclusiveSelectionExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
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
