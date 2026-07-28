import { DropdownMenuDriver } from '@atomic-testing/component-driver-astryx';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
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
  selectableMenu: {
    locator: byDataTestId('dropdown-selectable'),
    driver: DropdownMenuDriver,
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

      // The selectable menu mixes a plain menuitem-less checkbox item with a
      // radioGroup section — getItemLabels/getItemCount must not silently drop
      // the menuitemcheckbox/menuitemradio roles (see AstryxMenuDriver's
      // MENU_ITEM_SELECTOR doc for why a naive role="menuitem" selector would).
      test(`getItemLabels and getItemCount include checkbox and radio items`, async () => {
        assertEqual(await engine().parts.selectableMenu.getItemLabels(), ['Show archived', 'Newest', 'Oldest']);
        assertEqual(await engine().parts.selectableMenu.getItemCount(), 3);
      });

      // isItemChecked reflects aria-checked on the checkbox/radio items;
      // unchecked/absent items read false, including a plain menuitem.
      test(`isItemChecked reflects the checkbox and radio state`, async () => {
        assertFalse(await engine().parts.selectableMenu.isItemChecked('Show archived'));
        assertTrue(await engine().parts.selectableMenu.isItemChecked('Newest'));
        assertFalse(await engine().parts.selectableMenu.isItemChecked('Oldest'));
      });

      // isItemDisabled still works for a disabled radio item.
      test(`isItemDisabled reflects the disabled radio item`, async () => {
        assertTrue(await engine().parts.selectableMenu.isItemDisabled('Oldest'));
        assertFalse(await engine().parts.selectableMenu.isItemDisabled('Newest'));
      });

      // Clicking a checkbox item toggles it without closing the menu (default
      // hasCloseOnSelect=false); getItemByLabel + getRole confirm the ARIA role.
      test(`selecting the checkbox item toggles its checked state`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.selectableMenu.open();
        const checkboxItem = await engine().parts.selectableMenu.getItemByLabel('Show archived');
        assertEqual(await checkboxItem?.getRole(), 'menuitemcheckbox');
        assertTrue(await engine().parts.selectableMenu.selectByLabel('Show archived'));
        await engine().parts.selectableMenu.waitUntil({
          probeFn: () => engine().parts.selectableMenu.isItemChecked('Show archived'),
          terminateCondition: true,
          timeoutMs: 2000,
        });
      });
    });
  },
};
