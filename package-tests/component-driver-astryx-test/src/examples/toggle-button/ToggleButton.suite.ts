import { ToggleButtonDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { toggleButtonUIExample } from './ToggleButton.examples';

export const toggleButtonExampleScenePart = {
  boldToggle: {
    locator: byDataTestId('bold-toggle'),
    driver: ToggleButtonDriver,
  },
  italicToggle: {
    locator: byDataTestId('italic-toggle'),
    driver: ToggleButtonDriver,
  },
} satisfies ScenePart;

export const toggleButtonExample: IExampleUnit<typeof toggleButtonExampleScenePart, JSX.Element> = {
  ...toggleButtonUIExample,
  scene: toggleButtonExampleScenePart,
};

export const toggleButtonExampleTestSuite: TestSuiteInfo<typeof toggleButtonExample.scene> = {
  title: 'Astryx ToggleButton',
  url: '/toggle-button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${toggleButtonExample.title}`, () => {
      const engine = useTestEngine(toggleButtonExample.scene, getTestEngine, { beforeEach, afterEach });

      // isSelected reads aria-pressed.
      test(`isSelected reflects the pressed state`, async () => {
        assertTrue(await engine().parts.boldToggle.isSelected());
        assertFalse(await engine().parts.italicToggle.isSelected());
      });

      // setSelected clicks to reach the requested state.
      test(`setSelected toggles the pressed state`, async () => {
        await engine().parts.boldToggle.setSelected(false);
        assertFalse(await engine().parts.boldToggle.isSelected());
        await engine().parts.italicToggle.setSelected(true);
        assertTrue(await engine().parts.italicToggle.isSelected());
      });

      // getLabel returns the always-present aria-label.
      test(`getLabel returns the toggle's accessible name`, async () => {
        assertEqual(await engine().parts.boldToggle.getLabel(), 'Bold');
        assertEqual(await engine().parts.italicToggle.getLabel(), 'Italic');
      });
    });
  },
};
