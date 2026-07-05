import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ButtonDriver, MenuDriver, MenuItemNotFoundErrorId } from '@atomic-testing/component-driver-primevue-v4';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const menuScenePart = {
  toggle: {
    locator: byDataTestId('menu-toggle'),
    driver: ButtonDriver,
  },
  lastAction: {
    locator: byDataTestId('last-action'),
    driver: HTMLElementDriver,
  },
  menu: {
    locator: byDataTestId('actions-menu'),
    driver: MenuDriver,
  },
} satisfies ScenePart;

export const menuTestSuite: TestSuiteInfo<typeof menuScenePart> = {
  title: 'PrimeVue Menu',
  url: '/menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('PrimeVue Menu', () => {
      const engine = useTestEngine(menuScenePart, getTestEngine, { beforeEach, afterEach });

      const openMenu = async () => {
        await engine().parts.toggle.click();
        await engine().parts.menu.waitForOpen();
      };

      test('popup is closed initially and opens from its trigger', async () => {
        assertFalse(await engine().parts.menu.isOpen());
        await openMenu();
        assertTrue(await engine().parts.menu.isOpen());
      });

      test('counts every item across the separator', async () => {
        await openMenu();
        assertEqual(await engine().parts.menu.getMenuItemCount(), 3);
      });

      test('reads items by index, skipping the separator without losing count', async () => {
        await openMenu();
        assertEqual(await (await engine().parts.menu.getMenuItemByIndex(0))?.getLabel(), 'New file');
        assertEqual(await (await engine().parts.menu.getMenuItemByIndex(2))?.getLabel(), 'Delete');
        assertEqual(await engine().parts.menu.getMenuItemByIndex(3), null);
      });

      test('reads the disabled item', async () => {
        await openMenu();
        const deleteItem = await engine().parts.menu.getMenuItemByLabel('Delete');
        assertTrue(await deleteItem?.isDisabled());
        const duplicateItem = await engine().parts.menu.getMenuItemByLabel('Duplicate');
        assertFalse(await duplicateItem?.isDisabled());
      });

      test('activating an item runs its command and closes the popup', async () => {
        await openMenu();
        await engine().parts.menu.selectByLabel('Duplicate');
        assertTrue(await engine().parts.menu.waitForClose());
        assertEqual(await engine().parts.lastAction.getText(), 'duplicate');
      });

      test('selectByLabel throws MenuItemNotFoundError for an unknown label', async () => {
        await openMenu();
        let errorName = '';
        try {
          await engine().parts.menu.selectByLabel('Rename');
        } catch (error) {
          errorName = (error as Error).name;
        }
        assertEqual(errorName, MenuItemNotFoundErrorId);
      });
    });
  },
};
