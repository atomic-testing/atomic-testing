import { JSX } from 'react';
import { ToggleButtonGroupDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
    const engine = useTestEngine(regularSelectionExample.scene, getTestEngine, { beforeEach, afterEach });

    test('Initially there should be no selected value', async () => {
      const value = await engine().parts.formatting.getValue();
      assertEqual(value, []);
    });

    test('Selecting a value should update the value', async () => {
      await engine().parts.formatting.setValue(['bold', 'italic']);
      const value = await engine().parts.formatting.getValue();
      assertEqual(value, ['bold', 'italic']);
    });
  },
};
