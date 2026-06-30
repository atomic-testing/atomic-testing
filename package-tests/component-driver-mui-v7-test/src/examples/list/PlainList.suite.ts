import { ListDriver, ListItemDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { plainListUIExample } from './PlainList.example';

export const plainListExampleScenePart = {
  // No itemLocator override: relies on the ListDriver default to find the <li> items.
  plainList: {
    locator: byDataTestId('plain-list'),
    driver: ListDriver,
  },
  enabledItem: {
    locator: byDataTestId('enabled-item'),
    driver: ListItemDriver,
  },
  disabledItem: {
    locator: byDataTestId('disabled-item'),
    driver: ListItemDriver,
  },
} satisfies ScenePart;

export const plainListExample: IExampleUnit<typeof plainListExampleScenePart, JSX.Element> = {
  ...plainListUIExample,
  scene: plainListExampleScenePart,
};

export const plainListTestSuite: TestSuiteInfo<typeof plainListExample.scene> = {
  title: 'Plain List',
  url: '/list',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(plainListExample.scene, getTestEngine, { beforeEach, afterEach });

    test('default item locator finds the plain <li> items', async () => {
      // A plain <ListItem> renders as <li> with no explicit role; the default locator
      // must still enumerate them without the consumer overriding itemLocator.
      assertEqual(await engine().parts.plainList.getItemCount(), 3);
    });

    test('default item locator exposes each item driver', async () => {
      const items = await engine().parts.plainList.getItems();
      assertEqual(items.length, 3);
    });

    test('an enabled list item reports not disabled', async () => {
      assertFalse(await engine().parts.enabledItem.isDisabled());
    });

    test('a disabled <button> list item reports disabled', async () => {
      // <ListItemButton component="button" disabled> renders a native <button disabled>
      // with no aria-disabled — isDisabled must still detect it via Mui-disabled/disabled.
      assertTrue(await engine().parts.disabledItem.isDisabled());
    });
  },
};
