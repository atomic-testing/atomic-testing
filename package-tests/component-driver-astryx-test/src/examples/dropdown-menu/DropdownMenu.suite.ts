import { DropdownMenuDriver } from '@atomic-testing/component-driver-astryx';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { dropdownMenuUIExample } from './DropdownMenu.examples';

export const dropdownMenuExampleScenePart = {
  menu: {
    locator: byDataTestId('dropdown'),
    driver: DropdownMenuDriver,
  },
  last: {
    locator: byDataTestId('dropdown-last'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const dropdownMenuExample: IExampleUnit<typeof dropdownMenuExampleScenePart, JSX.Element> = {
  ...dropdownMenuUIExample,
  scene: dropdownMenuExampleScenePart,
};

export const dropdownMenuExampleTestSuite: TestSuiteInfo<typeof dropdownMenuExample.scene> = {
  title: 'Astryx DropdownMenu',
  url: '/dropdown-menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${dropdownMenuExample.title}`, () => {
      const engine = useTestEngine(dropdownMenuExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      // The menu items are always mounted, so labels/count read while closed.
      test(`getItemLabels lists the items`, async () => {
        assertEqual(await engine().parts.menu.getItemLabels(), ['Edit', 'Duplicate', 'Delete']);
        assertEqual(await engine().parts.menu.getItemCount(), 3);
      });

      // getTriggerLabel reads the trigger's visible text.
      test(`getTriggerLabel reads the trigger text`, async () => {
        assertEqual(await engine().parts.menu.getTriggerLabel(), 'Actions');
      });

      // isItemDisabled reflects aria-disabled on the item.
      test(`isItemDisabled reflects the disabled item`, async () => {
        assertTrue(await engine().parts.menu.isItemDisabled('Delete'));
        assertFalse(await engine().parts.menu.isItemDisabled('Edit'));
      });

      // open()/close() toggle the trigger; isOpen reads aria-expanded.
      // WebKit can't drive native-popover open/close (see skipInteractionOnWebkit).
      test(`open and close toggle the menu`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertFalse(await engine().parts.menu.isOpen());
        await engine().parts.menu.open();
        assertTrue(await engine().parts.menu.isOpen());
        await engine().parts.menu.close();
        assertFalse(await engine().parts.menu.isOpen());
      });

      // selectByLabel activates an item (open first so the panel is interactable in a browser).
      test(`selectByLabel activates the named item`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.menu.open();
        assertTrue(await engine().parts.menu.selectByLabel('Duplicate'));
        const last = await engine().parts.last.waitUntil({
          probeFn: () => engine().parts.last.getText(),
          terminateCondition: 'Duplicate',
          timeoutMs: 2000,
        });
        assertEqual(last, 'Duplicate');
      });

      test(`selectByLabel returns false for an unknown item`, async () => {
        assertFalse(await engine().parts.menu.selectByLabel('Nope'));
      });
    });
  },
};
