import {
  ButtonDriver,
  MenuButtonDriver,
  MenuDriver,
  SplitButtonDriver,
} from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { menuUIExample } from './Menu.examples';

export const menuExampleScenePart = {
  aTrigger: { locator: byDataTestId('menu-a-trigger'), driver: ButtonDriver },
  menuA: { locator: byDataTestId('menu-a-trigger'), driver: MenuDriver },
  cTrigger: { locator: byDataTestId('menu-c-trigger'), driver: ButtonDriver },
  menuC: { locator: byDataTestId('menu-c-trigger'), driver: MenuDriver },
  dTrigger: { locator: byDataTestId('menu-d-trigger'), driver: ButtonDriver },
  menuD: { locator: byDataTestId('menu-d-trigger'), driver: MenuDriver },
  menuButton: { locator: byDataTestId('menu-button'), driver: MenuButtonDriver },
  splitButton: { locator: byDataTestId('split-button'), driver: SplitButtonDriver },
} satisfies ScenePart;

export const menuExample: IExampleUnit<typeof menuExampleScenePart, JSX.Element> = {
  ...menuUIExample,
  scene: menuExampleScenePart,
};

export const menuExampleTestSuite: TestSuiteInfo<typeof menuExample.scene> = {
  title: 'Fluent Menu',
  url: '/menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('Fluent Menu', () => {
      const engine = useTestEngine(menuExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('menu is not open initially', async () => {
        assertFalse(await engine().parts.menuA.isOpen());
      });

      test('opens via trigger click and lists items in order', async () => {
        await engine().parts.aTrigger.click();
        assertTrue(await engine().parts.menuA.waitForOpen());
        assertEqual(await engine().parts.menuA.getMenuItemCount(), 6);
        const first = await engine().parts.menuA.getMenuItemByIndex(0);
        assertEqual(await first?.getLabel(), 'Cut');
      });

      test('reads a disabled item', async () => {
        await engine().parts.aTrigger.click();
        await engine().parts.menuA.waitForOpen();
        const paste = await engine().parts.menuA.getMenuItemByLabel('Paste');
        assertTrue(await paste?.isDisabled());
      });

      test('selectByLabel clicks the matching item and closes the menu', async () => {
        await engine().parts.aTrigger.click();
        await engine().parts.menuA.waitForOpen();
        await engine().parts.menuA.selectByLabel('Copy');
        assertTrue(await engine().parts.menuA.waitForClose());
      });

      test('reads and toggles a checkbox item (checkbox selection persists the open menu)', async () => {
        await engine().parts.aTrigger.click();
        await engine().parts.menuA.waitForOpen();
        const checkboxItem = await engine().parts.menuA.getCheckboxItemByLabel('Word wrap');
        assertFalse(await checkboxItem?.isChecked());
        await checkboxItem?.click();
        assertTrue(await checkboxItem?.isChecked());
      });

      test('reads radio items; selecting one closes the menu, and the choice persists on reopen', async () => {
        await engine().parts.aTrigger.click();
        await engine().parts.menuA.waitForOpen();
        const center = await engine().parts.menuA.getRadioItemByLabel('Align center');
        assertFalse(await center?.isChecked());
        await center?.click();
        assertTrue(await engine().parts.menuA.waitForClose());

        await engine().parts.aTrigger.click();
        await engine().parts.menuA.waitForOpen();
        const left = await engine().parts.menuA.getRadioItemByLabel('Align left');
        const centerReopened = await engine().parts.menuA.getRadioItemByLabel('Align center');
        assertTrue(await centerReopened?.isChecked());
        assertFalse(await left?.isChecked());
      });

      test('two simultaneously open menus disambiguate correctly', async () => {
        await engine().parts.cTrigger.click();
        await engine().parts.menuC.waitForOpen();
        await engine().parts.dTrigger.click();
        await engine().parts.menuD.waitForOpen();

        assertEqual(await engine().parts.menuC.getMenuItemCount(), 1);
        assertEqual(await engine().parts.menuD.getMenuItemCount(), 1);
        const cItem = await engine().parts.menuC.getMenuItemByIndex(0);
        const dItem = await engine().parts.menuD.getMenuItemByIndex(0);
        assertEqual(await cItem?.getLabel(), 'Menu C item');
        assertEqual(await dItem?.getLabel(), 'Menu D item');
      });

      test('closing one of two open menus leaves the other open', async () => {
        await engine().parts.cTrigger.click();
        await engine().parts.menuC.waitForOpen();
        await engine().parts.dTrigger.click();
        await engine().parts.menuD.waitForOpen();

        // Escape dismisses the topmost stacked menu (the last one opened) —
        // see MenuDriver.closeByEscape's class doc.
        assertTrue(await engine().parts.menuD.closeByEscape());
        assertFalse(await engine().parts.menuD.isOpen());
        assertTrue(await engine().parts.menuC.isOpen());
      });

      test('MenuButton opens its own menu via getMenu()', async () => {
        const menu = engine().parts.menuButton.getMenu();
        assertFalse(await menu.isOpen());
        await engine().parts.menuButton.click();
        assertTrue(await menu.waitForOpen());
        const item = await menu.getMenuItemByLabel('Menu button item');
        assertTrue(item != null);
      });

      test('SplitButton opens its menu independently from its primary action', async () => {
        const menu = engine().parts.splitButton.getMenu();
        assertFalse(await engine().parts.splitButton.isPrimaryDisabled());
        assertFalse(await menu.isOpen());
        await menu.open();
        assertTrue(await menu.waitForOpen());
        const item = await menu.getMenuItemByLabel('Split button item');
        assertTrue(item != null);
      });
    });
  },
};
