import { ListDriver, ListItemDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { listUIExample } from './List.examples';

export const listExampleScenePart = {
  plain: { locator: byDataTestId('list-plain'), driver: ListDriver },
  selectable: { locator: byDataTestId('list-selectable'), driver: ListDriver },
  selItemOne: { locator: byDataTestId('list-item-sel-one'), driver: ListItemDriver },
} satisfies ScenePart;

export const listExample: IExampleUnit<typeof listExampleScenePart, JSX.Element> = {
  ...listUIExample,
  scene: listExampleScenePart,
};

export const listExampleTestSuite: TestSuiteInfo<typeof listExample.scene> = {
  title: 'Fluent List',
  url: '/list',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse }) => {
    describe(`${listExample.title}`, () => {
      const engine = useTestEngine(listExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('enumerates items and reads each one’s value and text', async () => {
        assertEqual(await engine().parts.plain.getItemCount(), 2);
        const first = await engine().parts.plain.getItemByIndex(0);
        assertEqual(await first?.getValue(), '1');
        assertEqual(await first?.getText(), 'Item One');
      });

      test('an item in a non-selectable list is never selected', async () => {
        const first = await engine().parts.plain.getItemByIndex(0);
        assertFalse((await first?.isSelected()) ?? true);
      });

      test('a selectable list toggles item selection when clicked', async () => {
        assertFalse(await engine().parts.selItemOne.isSelected());
        await engine().parts.selItemOne.setSelected(true);
        assertEqual(await engine().parts.selectable.getSelectedValues(), ['a']);
        await engine().parts.selItemOne.setSelected(false);
        assertEqual(await engine().parts.selectable.getSelectedValues(), []);
      });
    });
  },
};
