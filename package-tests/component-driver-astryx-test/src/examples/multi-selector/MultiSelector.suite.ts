import { MultiSelectorDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { multiSelectorUIExample } from './MultiSelector.examples';

export const multiSelectorExampleScenePart = {
  fruits: {
    locator: byDataTestId('fruits'),
    driver: MultiSelectorDriver,
  },
  perms: {
    locator: byDataTestId('perms'),
    driver: MultiSelectorDriver,
  },
} satisfies ScenePart;

export const multiSelectorExample: IExampleUnit<typeof multiSelectorExampleScenePart, JSX.Element> = {
  ...multiSelectorUIExample,
  scene: multiSelectorExampleScenePart,
};

export const multiSelectorExampleTestSuite: TestSuiteInfo<typeof multiSelectorExample.scene> = {
  title: 'Astryx MultiSelector',
  url: '/multi-selector',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${multiSelectorExample.title}`, () => {
      const engine = useTestEngine(multiSelectorExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      // getOptionLabels enumerates the options; getSelectedLabels reflects the initial value.
      test(`enumerates options and selected labels`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertEqual(await engine().parts.fruits.getOptionLabels(), ['Apple', 'Banana', 'Cherry']);
        assertEqual(await engine().parts.fruits.getSelectedLabels(), ['Apple']);
        assertEqual(await engine().parts.fruits.getSelectedCount(), 1);
        assertTrue(await engine().parts.fruits.isOptionSelected('Apple'));
        assertFalse(await engine().parts.fruits.isOptionSelected('Banana'));
      });

      // toggleByLabel adds and removes options.
      test(`toggleByLabel toggles options`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertTrue(await engine().parts.fruits.toggleByLabel('Banana'));
        assertTrue(await engine().parts.fruits.isOptionSelected('Banana'));
        assertEqual(await engine().parts.fruits.getSelectedCount(), 2);

        await engine().parts.fruits.toggleByLabel('Apple');
        assertFalse(await engine().parts.fruits.isOptionSelected('Apple'));
        assertFalse(await engine().parts.fruits.toggleByLabel('Nope'));
      });

      // clearAll empties the selection via the trigger's clear control.
      test(`clearAll clears the selection`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertTrue(await engine().parts.fruits.clearAll());
        assertEqual(await engine().parts.fruits.getSelectedCount(), 0);
      });

      // selectAll checks every option (perms enables hasSelectAll).
      test(`selectAll selects every option`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertTrue(await engine().parts.perms.selectAll());
        assertTrue(await engine().parts.perms.isOptionSelected('Read'));
        assertTrue(await engine().parts.perms.isOptionSelected('Write'));
      });
    });
  },
};
