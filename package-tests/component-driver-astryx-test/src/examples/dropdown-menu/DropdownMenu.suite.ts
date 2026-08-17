import { DropdownMenuDriver, SubMenuDriver } from '@atomic-testing/component-driver-astryx';
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
  nestedMenu: {
    locator: byDataTestId('dropdown-nested'),
    driver: DropdownMenuDriver,
  },
  // A submenu is named the way any other overlay is: anchor its driver on the
  // trigger, which Astryx forwards `data-testid` onto.
  subMenu: {
    locator: byDataTestId('dropdown-submenu'),
    driver: SubMenuDriver,
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

      // A submenu trigger is itself a menuitem, so it enumerates with the rest.
      test(`the parent menu lists the submenu trigger among its items`, async () => {
        assertEqual(await engine().parts.nestedMenu.getItemLabels(), ['Rename', 'Move to', 'Delete']);
        const trigger = await engine().parts.nestedMenu.getItemByLabel('Move to');
        assertTrue(await trigger!.hasSubMenu());
        const plain = await engine().parts.nestedMenu.getItemByLabel('Rename');
        assertFalse(await plain!.hasSubMenu());
      });

      // Astryx 0.4.0 reflects variant="destructive" on the row as data-variant.
      test(`isDestructive marks the destructive row`, async () => {
        const remove = await engine().parts.nestedMenu.getItemByLabel('Delete');
        assertTrue(await remove!.isDestructive());
        const rename = await engine().parts.nestedMenu.getItemByLabel('Rename');
        assertFalse(await rename!.isDestructive());
      });

      // The flyout is resolved by its aria-labelledby back-link rather than the
      // trigger's aria-controls (which Astryx omits while closed), so the
      // submenu's items read without opening anything.
      test(`the submenu enumerates its items while closed`, async () => {
        assertFalse(await engine().parts.subMenu.isOpen());
        assertEqual(await engine().parts.subMenu.getItemLabels(), ['Inbox', 'Archive']);
        assertEqual(await engine().parts.subMenu.getItemCount(), 2);
      });

      // Selecting inside the flyout is a real interaction, so WebKit is gated.
      test(`selecting a submenu item fires its action`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.nestedMenu.open();
        await engine().parts.subMenu.open();
        assertTrue(await engine().parts.subMenu.selectByLabel('Archive'));
        await engine().parts.last.waitUntil({
          probeFn: () => engine().parts.last.getText(),
          terminateCondition: 'Archive',
          timeoutMs: 2000,
        });
      });
    });
  },
};
