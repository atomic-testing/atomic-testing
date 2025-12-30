import { CheckboxDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertTrue, assertFalse }) => {
    const engine = useTestEngine(iconCheckboxExample.scene, getTestEngine, { beforeEach, afterEach });

    test('Favorite checkbox should not be selected initially', async () => {
      const isSelected = await engine().parts.favorite.isSelected();
      assertFalse(isSelected);
    });

    test('Bookmark checkbox should not be selected initially', async () => {
      const isSelected = await engine().parts.bookmark.isSelected();
      assertFalse(isSelected);
    });

    test('Favorite checkbox can be selected', async () => {
      await engine().parts.favorite.setSelected(true);
      const isSelected = await engine().parts.favorite.isSelected();
      assertTrue(isSelected);
    });
  },
};
