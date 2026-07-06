import { ToggleDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { toggleUIExample } from './Toggle.examples';

export const toggleExampleScenePart = {
  bold: {
    locator: byDataTestId('toggle-bold'),
    driver: ToggleDriver,
  },
  disabled: {
    locator: byDataTestId('toggle-disabled'),
    driver: ToggleDriver,
  },
} satisfies ScenePart;

export const toggleExample: IExampleUnit<typeof toggleExampleScenePart, JSX.Element> = {
  ...toggleUIExample,
  scene: toggleExampleScenePart,
};

export const toggleExampleTestSuite: TestSuiteInfo<typeof toggleExample.scene> = {
  title: 'Radix Toggle',
  url: '/toggle',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertTrue, assertFalse }) => {
    describe(`${toggleExample.title}`, () => {
      const engine = useTestEngine(toggleExample.scene, getTestEngine, { beforeEach, afterEach });

      test('toggles pressed state independently per instance', async () => {
        assertFalse(await engine().parts.bold.isSelected());
        assertTrue(await engine().parts.disabled.isSelected());

        await engine().parts.bold.setSelected(true);
        assertTrue(await engine().parts.bold.isSelected());

        await engine().parts.bold.setSelected(false);
        assertFalse(await engine().parts.bold.isSelected());
      });

      test('reads disabled state per instance', async () => {
        assertFalse(await engine().parts.bold.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());
      });
    });
  },
};
