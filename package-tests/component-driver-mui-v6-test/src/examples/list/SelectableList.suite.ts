import { ListDriver, ListItemDriver } from '@atomic-testing/component-driver-mui-v6';
import { TestEngine, byDataTestId, byRole, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof selectableListExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(selectableListExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('List should exist', async () => {
      const exists = await testEngine.parts.selectableList.exists();
      assertEqual(exists, true);
    });

    test('List should have multiple items', async () => {
      const items = await testEngine.parts.selectableList.getItems();
      assertEqual(items.length >= 4, true);
    });

    test('Can get list item by label', async () => {
      const draftItem = await testEngine.parts.selectableList.getItemByLabel('Drafts');
      const exists = await draftItem?.exists();
      assertEqual(exists, true);
    });

    test('Drafts item should be selected initially', async () => {
      const draftItem = await testEngine.parts.selectableList.getItemByLabel('Drafts');
      const isSelected = await draftItem?.isSelected();
      assertEqual(isSelected, true);
    });
  },
};
