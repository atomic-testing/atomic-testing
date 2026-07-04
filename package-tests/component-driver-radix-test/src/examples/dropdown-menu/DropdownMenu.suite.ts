import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { DropdownMenuDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { dropdownMenuUIExample } from './DropdownMenu.examples';

export const dropdownMenuExampleScenePart = {
  trigger: {
    locator: byDataTestId('dropdown-menu-trigger'),
    driver: HTMLButtonDriver,
  },
  menu: {
    locator: byDataTestId('dropdown-menu-content'),
    driver: DropdownMenuDriver,
  },
} satisfies ScenePart;

export const dropdownMenuExample: IExampleUnit<typeof dropdownMenuExampleScenePart, JSX.Element> = {
  ...dropdownMenuUIExample,
  scene: dropdownMenuExampleScenePart,
};

export const dropdownMenuExampleTestSuite: TestSuiteInfo<typeof dropdownMenuExample.scene> = {
  title: 'Radix DropdownMenu',
  url: '/dropdown-menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${dropdownMenuExample.title}`, () => {
      const engine = useTestEngine(dropdownMenuExample.scene, getTestEngine, { beforeEach, afterEach });

      test('is not open initially', async () => {
        assertFalse(await engine().parts.menu.isOpen());
      });

      test('clicking the trigger opens the menu', async () => {
        await engine().parts.trigger.click();
        assertTrue(await engine().parts.menu.isOpen());
      });

      // Profile, Billing, [separator], Log out — the separator (a same-tag
      // <div role="separator">) is what makes childListHelper load-bearing here;
      // see DropdownMenuDriver's doc comment for why listHelper's :nth-of-type
      // walk would silently truncate this count at 2.
      test('counts items, skipping the separator', async () => {
        await engine().parts.trigger.click();
        assertEqual(await engine().parts.menu.getMenuItemCount(), 3);
      });

      test('finds an item by label past the separator', async () => {
        await engine().parts.trigger.click();
        const logout = await engine().parts.menu.getMenuItemByLabel('Log out');
        assertTrue(logout != null);
        assertEqual(await logout?.getLabel(), 'Log out');
      });

      test('reports the disabled item as disabled', async () => {
        await engine().parts.trigger.click();
        const billing = await engine().parts.menu.getMenuItemByLabel('Billing');
        assertTrue(await billing?.isDisabled());
      });

      test('reports an enabled item as not disabled', async () => {
        await engine().parts.trigger.click();
        const profile = await engine().parts.menu.getMenuItemByLabel('Profile');
        assertFalse(await profile?.isDisabled());
      });

      test('selectByLabel clicks the item and closes the menu', async () => {
        await engine().parts.trigger.click();
        await engine().parts.menu.selectByLabel('Profile');
        assertFalse(await engine().parts.menu.isOpen());
      });

      test('getMenuItemByIndex returns items in DOM order, skipping the separator', async () => {
        await engine().parts.trigger.click();
        const first = await engine().parts.menu.getMenuItemByIndex(0);
        const third = await engine().parts.menu.getMenuItemByIndex(2);
        assertEqual(await first?.getLabel(), 'Profile');
        assertEqual(await third?.getLabel(), 'Log out');
      });
    });
  },
};
