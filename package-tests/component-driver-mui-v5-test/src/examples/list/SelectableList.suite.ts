import { ListDriver, ListItemDriver } from '@atomic-testing/component-driver-mui-v5';
import { TestEngine, byDataTestId, byRole, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
    let testEngine: TestEngine<typeof selectableListExample.scene>;

    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(selectableListExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('List should exist', async () => {
      const exists = await testEngine.parts.selectableList.exists();
      assertTrue(exists);
    });

    test('List should have multiple items', async () => {
      const items = await testEngine.parts.selectableList.getItems();
      assertTrue(items.length >= 4);
    });

    test('Can get list item by label', async () => {
      const draftItem = await testEngine.parts.selectableList.getItemByLabel('Drafts');
      const exists = await draftItem?.exists();
      assertTrue(exists);
    });

    test('Drafts item should be selected initially', async () => {
      const draftItem = await testEngine.parts.selectableList.getItemByLabel('Drafts');
      const isSelected = await draftItem?.isSelected();
      assertTrue(isSelected);
    });
  },
};
