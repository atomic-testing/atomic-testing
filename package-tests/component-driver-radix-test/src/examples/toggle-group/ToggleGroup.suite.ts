import { ToggleGroupDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { toggleGroupUIExample } from './ToggleGroup.examples';

export const toggleGroupExampleScenePart = {
  single: {
    locator: byDataTestId('toggle-group-single'),
    driver: ToggleGroupDriver,
  },
  multiple: {
    locator: byDataTestId('toggle-group-multiple'),
    driver: ToggleGroupDriver,
  },
} satisfies ScenePart;

export const toggleGroupExample: IExampleUnit<typeof toggleGroupExampleScenePart, JSX.Element> = {
  ...toggleGroupUIExample,
  scene: toggleGroupExampleScenePart,
};

export const toggleGroupExampleTestSuite: TestSuiteInfo<typeof toggleGroupExample.scene> = {
  title: 'Radix ToggleGroup',
  url: '/toggle-group',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${toggleGroupExample.title}`, () => {
      const engine = useTestEngine(toggleGroupExample.scene, getTestEngine, { beforeEach, afterEach });

      test('reads item labels and count', async () => {
        assertEqual(await engine().parts.single.getItemLabels(), ['Left', 'Center', 'Right']);
        assertEqual(await engine().parts.single.getItemCount(), 3);
      });

      test('reads the default selection in single mode (role=radiogroup DOM)', async () => {
        assertEqual(await engine().parts.single.getSelectedLabels(), ['Left']);
      });

      test('reads the default selection in multiple mode (role=toolbar DOM)', async () => {
        assertEqual(await engine().parts.multiple.getSelectedLabels(), ['Bold']);
      });

      test('selects an item by label', async () => {
        const center = await engine().parts.single.getItemByLabel('Center');
        assertTrue(center != null);
        await center!.setSelected(true);
        assertEqual(await engine().parts.single.getSelectedLabels(), ['Center']);
      });

      test('selects an item by index', async () => {
        const italic = await engine().parts.multiple.getItemByIndex(1);
        assertTrue(italic != null);
        await italic!.setSelected(true);
        assertEqual(await engine().parts.multiple.getSelectedLabels(), ['Bold', 'Italic']);
      });

      test('reads per-item disabled state', async () => {
        const right = await engine().parts.single.getItemByLabel('Right');
        assertTrue(right != null && (await right.isDisabled()));
        const left = await engine().parts.single.getItemByLabel('Left');
        assertFalse(left != null && (await left.isDisabled()));
      });
    });
  },
};
