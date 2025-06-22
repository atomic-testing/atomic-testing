import { CheckboxDriver } from '@atomic-testing/component-driver-mui-v7';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';

import { iconCheckboxUIExample } from './IconCheckbox.examples';

export const iconCheckboxExampleScenePart = {
  favorite: {
    locator: byDataTestId('favorite'),
    driver: CheckboxDriver,
  },
  bookmark: {
    locator: byDataTestId('bookmark'),
    driver: CheckboxDriver,
  },
} satisfies ScenePart;

export const iconCheckboxExample: IExampleUnit<typeof iconCheckboxExampleScenePart, JSX.Element> = {
  ...iconCheckboxUIExample,
  scene: iconCheckboxExampleScenePart,
};

export const iconCheckboxTestSuite: TestSuiteInfo<typeof iconCheckboxExample.scene> = {
  title: 'Icon Checkbox',
  url: '/checkbox',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof iconCheckboxExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(iconCheckboxExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Favorite checkbox should not be selected initially', async () => {
      const isSelected = await testEngine.parts.favorite.isSelected();
      assertEqual(isSelected, false);
    });

    test('Bookmark checkbox should not be selected initially', async () => {
      const isSelected = await testEngine.parts.bookmark.isSelected();
      assertEqual(isSelected, false);
    });

    test('Favorite checkbox can be selected', async () => {
      await testEngine.parts.favorite.setSelected(true);
      const isSelected = await testEngine.parts.favorite.isSelected();
      assertEqual(isSelected, true);
    });
  },
};
