import { JSX } from 'react';
import { ExclusiveToggleButtonGroupDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
    const engine = useTestEngine(exclusiveSelectionExample.scene, getTestEngine, { beforeEach, afterEach });

    test('Initially there should be no selected value', async () => {
      const value = await engine().parts.alignment.getValue();
      assertEqual(value, null);
    });

    test('Selecting a value should update the value', async () => {
      await engine().parts.alignment.setValue('center');
      const value = await engine().parts.alignment.getValue();
      assertEqual(value, 'center');
    });
  },
};
