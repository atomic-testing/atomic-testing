import { JSX } from 'react';
import { ToggleButtonDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { singleToggleUIExample } from './SingleToggle.example';

export const singleToggleExampleScenePart = {
  singleToggle: {
    locator: byDataTestId('single-toggle'),
    driver: ToggleButtonDriver,
  },
} satisfies ScenePart;

export const singleToggleExample: IExampleUnit<typeof singleToggleExampleScenePart, JSX.Element> = {
  ...singleToggleUIExample,
  scene: singleToggleExampleScenePart,
};

export const singleToggleButtonTestSuite: TestSuiteInfo<typeof singleToggleExampleScenePart> = {
  title: 'Single Toggle Button',
  url: '/toggle-button',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertTrue, assertFalse }) => {
    const engine = useTestEngine(singleToggleExample.scene, getTestEngine, { beforeEach, afterEach });

    test('Initially selected state should be false', async () => {
      const selected = await engine().parts.singleToggle.isSelected();
      assertFalse(selected);
    });

    test('Click on the button would set selected state to true', async () => {
      await engine().parts.singleToggle.click();
      const selected = await engine().parts.singleToggle.isSelected();
      assertTrue(selected);
    });

    test('Set the selected state would yield the correct selected state', async () => {
      await engine().parts.singleToggle.setSelected(true);
      const selected = await engine().parts.singleToggle.isSelected();
      assertTrue(selected);
    });
  },
};
