import { ToggleButtonDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { toggleButtonUIExample } from './ToggleButton.examples';

export const toggleButtonExampleScenePart = {
  off: { locator: byDataTestId('toggle-button-off'), driver: ToggleButtonDriver },
  on: { locator: byDataTestId('toggle-button-on'), driver: ToggleButtonDriver },
} satisfies ScenePart;

export const toggleButtonExample: IExampleUnit<typeof toggleButtonExampleScenePart, JSX.Element> = {
  ...toggleButtonUIExample,
  scene: toggleButtonExampleScenePart,
};

export const toggleButtonExampleTestSuite: TestSuiteInfo<typeof toggleButtonExample.scene> = {
  title: 'Fluent ToggleButton',
  url: '/toggle-button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertFalse, assertTrue }) => {
    describe(`${toggleButtonExample.title}`, () => {
      const engine = useTestEngine(toggleButtonExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads its own pressed state per instance', async () => {
        assertFalse(await engine().parts.off.isSelected());
        assertTrue(await engine().parts.on.isSelected());
      });

      test('toggles pressed state on click', async () => {
        await engine().parts.off.setSelected(true);
        assertTrue(await engine().parts.off.isSelected());

        await engine().parts.off.setSelected(false);
        assertFalse(await engine().parts.off.isSelected());
      });
    });
  },
};
