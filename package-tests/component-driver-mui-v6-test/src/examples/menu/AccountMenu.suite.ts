import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ButtonDriver, MenuDriver } from '@atomic-testing/component-driver-mui-v6';
import { byCssSelector, byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { accountMenuUIExample } from './AccountMenu.examples';

/**
 * A deliberately anchor-sensitive interior: the FIRST DIRECT CHILD of whatever
 * `within` resolves against. Anchored on the menu list it is the caller's first
 * `MenuItem`; anchored on the Modal root it would be `.MuiBackdrop-root`.
 */
const firstInteriorChildPart = {
  firstChild: {
    locator: byCssSelector('*', 'Child'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const accountMenuExampleScenePart = {
  menu: {
    locator: byDataTestId('account-menu'),
    driver: MenuDriver,
  },
  disclosure: {
    locator: byDataTestId('account-menu-trigger'),
    driver: ButtonDriver,
  },
  selection: {
    locator: byDataTestId('account-menu-selection'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Basic Progress example from MUI's website
 * @see https://mui.com/material-ui/react-progress
 */
export const accountMenuExample: IExampleUnit<typeof accountMenuExampleScenePart, JSX.Element> = {
  ...accountMenuUIExample,
  scene: accountMenuExampleScenePart,
};

export const accountMenuTestSuite: TestSuiteInfo<typeof accountMenuExample.scene> = {
  title: 'Account Menu',
  url: '/menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(accountMenuExample.scene, getTestEngine, { beforeEach, afterEach });

    describe('When menu is open', () => {
      beforeEach(async () => {
        await engine().parts.disclosure.click();
      });

      test('Settings menu item should be selected', async () => {
        const item = await engine().parts.menu.getMenuItemByLabel('Settings');
        const isSelected = await item?.isSelected();
        assertTrue(isSelected);
      });

      test('Profile menu item should not be selected', async () => {
        const item = await engine().parts.menu.getMenuItemByLabel('Profile');
        const isSelected = await item?.isSelected();
        assertFalse(isSelected);
      });

      test('Clicking on Profile menu item should select it', async () => {
        await engine().parts.menu.selectByLabel('Profile');
        const selection = await engine().parts.selection.getText();
        assertEqual(selection, 'Profile');
      });

      test('Logout menu item should be disabled', async () => {
        const item = await engine().parts.menu.getMenuItemByLabel('Logout');
        const isDisabled = await item?.isDisabled();
        assertTrue(isDisabled);
      });

      // Regression for the interior anchor (ADR-019): MUI's menu locator is the
      // portal-rendered Modal root, whose own children are the invisible backdrop
      // and the focus-trap sentinels. `within` must resolve against the menu list
      // instead, or every relative interior part silently addresses MUI chrome.
      test('Interior parts anchor on the menu list, not the modal root', async () => {
        const firstChild = engine().parts.menu.within(firstInteriorChildPart).firstChild;
        assertEqual(await firstChild.getAttribute('data-testid'), 'menu-profile');
      });

      test('getMenuItemCount reports the number of items', async () => {
        assertEqual(await engine().parts.menu.getMenuItemCount(), 5);
      });

      test('getMenuItemByIndex returns the item at that position', async () => {
        const first = await engine().parts.menu.getMenuItemByIndex(0);
        assertEqual(await first?.label(), 'Profile');
        const outOfRange = await engine().parts.menu.getMenuItemByIndex(99);
        assertEqual(outOfRange, undefined);
      });
    });
  },
};
