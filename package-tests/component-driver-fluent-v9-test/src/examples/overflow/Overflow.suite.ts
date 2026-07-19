import { OverflowDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { overflowUIExample } from './Overflow.examples';

export const overflowExampleScenePart = {
  row: { locator: byDataTestId('overflow-row'), driver: OverflowDriver },
} satisfies ScenePart;

export const overflowExample: IExampleUnit<typeof overflowExampleScenePart, JSX.Element> = {
  ...overflowUIExample,
  scene: overflowExampleScenePart,
};

export const overflowExampleTestSuite: TestSuiteInfo<typeof overflowExample.scene> = {
  title: 'Fluent Overflow',
  url: '/overflow',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${overflowExample.title}`, () => {
      const engine = useTestEngine(overflowExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('counts and labels every registered item', async () => {
        assertEqual(await engine().parts.row.getItemCount(), 3);
        assertEqual(await engine().parts.row.getItemLabels(), ['Item one', 'Item two', 'Item three']);
      });

      test('getItemByLabel resolves an item, or null when absent', async () => {
        const item = await engine().parts.row.getItemByLabel('Item two');
        assertEqual(await item?.getLabel(), 'Item two');
        assertFalse(await item!.isOverflowing());

        assertEqual(await engine().parts.row.getItemByLabel('Nonexistent'), null);
      });

      test('no items overflow when the row has enough room (default layout)', async () => {
        assertEqual(await engine().parts.row.getOverflowingItemLabels(), []);
      });

      test('getOverflowMenu resolves the "+N" trigger as a working MenuDriver', async () => {
        const overflowMenu = engine().parts.row.getOverflowMenu();
        assertFalse(await overflowMenu.isOpen());

        await overflowMenu.open();
        assertTrue(await overflowMenu.waitForOpen());
        assertEqual(await overflowMenu.getMenuItemCount(), 3);

        const firstItem = await overflowMenu.getMenuItemByLabel('Item one');
        assertEqual(await firstItem?.getLabel(), 'Item one');

        await overflowMenu.close();
        assertTrue(await overflowMenu.waitForClose());
      });
    });
  },
};
