import { ToggleButtonGroupDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { toggleButtonGroupUIExample } from './ToggleButtonGroup.examples';

export const toggleButtonGroupExampleScenePart = {
  group: {
    locator: byDataTestId('format-group'),
    driver: ToggleButtonGroupDriver,
  },
} satisfies ScenePart;

export const toggleButtonGroupExample: IExampleUnit<typeof toggleButtonGroupExampleScenePart, JSX.Element> = {
  ...toggleButtonGroupUIExample,
  scene: toggleButtonGroupExampleScenePart,
};

export const toggleButtonGroupExampleTestSuite: TestSuiteInfo<typeof toggleButtonGroupExample.scene> = {
  title: 'Astryx ToggleButtonGroup',
  url: '/toggle-button-group',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${toggleButtonGroupExample.title}`, () => {
      const engine = useTestEngine(toggleButtonGroupExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel reads the group's accessible name.
      test(`getLabel returns the group accessible name`, async () => {
        assertEqual(await engine().parts.group.getLabel(), 'Format');
      });

      // isSelected and getSelectedLabels read aria-pressed by item aria-label.
      test(`isSelected and getSelectedLabels reflect the pressed item`, async () => {
        assertTrue(await engine().parts.group.isSelected('Bold'));
        assertFalse(await engine().parts.group.isSelected('Italic'));
        assertEqual(await engine().parts.group.getSelectedLabels(), ['Bold']);
      });

      // getItemCount counts the toggles.
      test(`getItemCount counts the toggles`, async () => {
        assertEqual(await engine().parts.group.getItemCount(), 3);
      });

      // select switches the single selection (the previous one releases).
      test(`select moves the single selection`, async () => {
        await engine().parts.group.select('Italic');
        assertTrue(await engine().parts.group.isSelected('Italic'));
        assertFalse(await engine().parts.group.isSelected('Bold'));
        assertEqual(await engine().parts.group.getSelectedLabels(), ['Italic']);
      });
    });
  },
};
