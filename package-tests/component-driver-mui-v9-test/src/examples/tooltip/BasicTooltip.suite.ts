import { TooltipDriver } from '@atomic-testing/component-driver-mui-v9';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicTooltipUIExample } from './BasicTooltip.example';

export const basicTooltipExampleScenePart = {
  deleteButton: {
    locator: byDataTestId('delete-button'),
    driver: TooltipDriver,
  },
  addButton: {
    locator: byDataTestId('add-button'),
    driver: TooltipDriver,
  },
  plainButton: {
    locator: byDataTestId('plain-button'),
    driver: TooltipDriver,
  },
} satisfies ScenePart;

export const basicTooltipExample: IExampleUnit<typeof basicTooltipExampleScenePart, JSX.Element> = {
  ...basicTooltipUIExample,
  scene: basicTooltipExampleScenePart,
};

export const basicTooltipTestSuite: TestSuiteInfo<typeof basicTooltipExampleScenePart> = {
  title: 'Basic Tooltip',
  url: '/tooltip',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(basicTooltipExample.scene, getTestEngine, { beforeEach, afterEach });

    test('reveals its title on hover', async () => {
      assertEqual(await engine().parts.deleteButton.getTitle(), 'Delete the item');
    });

    test('reads each trigger’s own title', async () => {
      assertEqual(await engine().parts.deleteButton.getTitle(), 'Delete the item');
      assertEqual(await engine().parts.addButton.getTitle(), 'Add an item');
    });

    test('is not visible until revealed', async () => {
      assertFalse(await engine().parts.addButton.isVisible());
      await engine().parts.addButton.show();
      assertTrue(await engine().parts.addButton.isVisible());
    });

    test('returns undefined when the trigger has no tooltip', async () => {
      assertEqual(await engine().parts.plainButton.getTitle(), undefined);
    });
  },
};
