import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ButtonDriver, MenuDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

import { accountMenuUIExample } from './AccountMenu.examples';

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
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof accountMenuExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(accountMenuExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    describe('When menu is open', () => {
      beforeEach(async () => {
        await testEngine.parts.disclosure.click();
      });

      test('Settings menu item should be selected', async () => {
        const item = await testEngine.parts.menu.getMenuItemByLabel('Settings');
        const isSelected = await item?.isSelected();
        assertEqual(isSelected, true);
      });

      test('Profile menu item should not be selected', async () => {
        const item = await testEngine.parts.menu.getMenuItemByLabel('Profile');
        const isSelected = await item?.isSelected();
        assertEqual(isSelected, false);
      });

      test('Clicking on Profile menu item should select it', async () => {
        await testEngine.parts.menu.selectByLabel('Profile');
        const selection = await testEngine.parts.selection.getText();
        assertEqual(selection, 'Profile');
      });

      test('Logout menu item should be disabled', async () => {
        const item = await testEngine.parts.menu.getMenuItemByLabel('Logout');
        const isDisabled = await item?.isDisabled();
        assertEqual(isDisabled, true);
      });
    });
  },
};
