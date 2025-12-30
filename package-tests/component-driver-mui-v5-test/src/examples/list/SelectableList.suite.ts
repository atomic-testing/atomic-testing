import { ListDriver, ListItemDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, byRole, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { selectableListUIExample } from './SelectableList.example';

export const selectableListExampleScenePart = {
  selectableList: {
    locator: byDataTestId('selectable-list'),
    driver: ListDriver,
    option: {
      itemLocator: byRole('button'),
      itemClass: ListItemDriver,
    },
  },
} satisfies ScenePart;

export const selectableListExample: IExampleUnit<typeof selectableListExampleScenePart, JSX.Element> = {
  ...selectableListUIExample,
  scene: selectableListExampleScenePart,
};

export const selectableListTestSuite: TestSuiteInfo<typeof selectableListExample.scene> = {
  title: 'Selectable List',
  url: '/list',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertTrue }) => {
    const engine = useTestEngine(selectableListExample.scene, getTestEngine, { beforeEach, afterEach });

    test('List should exist', async () => {
      const exists = await engine().parts.selectableList.exists();
      assertTrue(exists);
    });

    test('List should have multiple items', async () => {
      const items = await engine().parts.selectableList.getItems();
      assertTrue(items.length >= 4);
    });

    test('Can get list item by label', async () => {
      const draftItem = await engine().parts.selectableList.getItemByLabel('Drafts');
      const exists = await draftItem?.exists();
      assertTrue(exists);
    });

    test('Drafts item should be selected initially', async () => {
      const draftItem = await engine().parts.selectableList.getItemByLabel('Drafts');
      const isSelected = await draftItem?.isSelected();
      assertTrue(isSelected);
    });
  },
};
