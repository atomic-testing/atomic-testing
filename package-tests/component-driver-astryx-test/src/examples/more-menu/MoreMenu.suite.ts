import { MoreMenuDriver } from '@atomic-testing/component-driver-astryx';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { moreMenuUIExample } from './MoreMenu.examples';

export const moreMenuExampleScenePart = {
  menu: {
    locator: byDataTestId('more-menu'),
    driver: MoreMenuDriver,
  },
  last: {
    locator: byDataTestId('more-menu-last'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const moreMenuExample: IExampleUnit<typeof moreMenuExampleScenePart, JSX.Element> = {
  ...moreMenuUIExample,
  scene: moreMenuExampleScenePart,
};

export const moreMenuExampleTestSuite: TestSuiteInfo<typeof moreMenuExample.scene> = {
  title: 'Astryx MoreMenu',
  url: '/more-menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${moreMenuExample.title}`, () => {
      const engine = useTestEngine(moreMenuExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      // Items read while closed (always mounted), same as DropdownMenu.
      test(`getItemLabels lists the items`, async () => {
        assertEqual(await engine().parts.menu.getItemLabels(), ['Rename', 'Archive', 'Delete']);
        assertEqual(await engine().parts.menu.getItemCount(), 3);
      });

      // The icon-only trigger names itself via aria-label.
      test(`getTriggerLabel reads the aria-label`, async () => {
        assertEqual(await engine().parts.menu.getTriggerLabel(), 'More options');
      });

      // isItemDisabled reflects aria-disabled.
      test(`isItemDisabled reflects the disabled item`, async () => {
        assertTrue(await engine().parts.menu.isItemDisabled('Delete'));
        assertFalse(await engine().parts.menu.isItemDisabled('Rename'));
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

      // selectByLabel activates an item (open first for browser interactability).
      test(`selectByLabel activates the named item`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.menu.open();
        assertTrue(await engine().parts.menu.selectByLabel('Archive'));
        const last = await engine().parts.last.waitUntil({
          probeFn: () => engine().parts.last.getText(),
          terminateCondition: 'Archive',
          timeoutMs: 2000,
        });
        assertEqual(last, 'Archive');
      });

      test(`selectByLabel returns false for an unknown item`, async () => {
        assertFalse(await engine().parts.menu.selectByLabel('Nope'));
      });
    });
  },
};
