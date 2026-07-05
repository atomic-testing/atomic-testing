import { ButtonDriver, MenuDriver } from '@atomic-testing/component-driver-angular-material-v21';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byAriaLabel, byDataTestId, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const menuScenePart = {
  accountTrigger: {
    locator: byDataTestId('account-menu-trigger'),
    driver: ButtonDriver,
  },
  sortTrigger: {
    locator: byDataTestId('sort-menu-trigger'),
    driver: ButtonDriver,
  },
  // Menus are located by the panel's aria-label (the `<mat-menu aria-label>`
  // input) — the driver re-roots the lookup into the CDK overlay container.
  accountMenu: {
    locator: byAriaLabel('Account menu'),
    driver: MenuDriver,
  },
  sortMenu: {
    locator: byAriaLabel('Sort menu'),
    driver: MenuDriver,
  },
  selection: {
    locator: byDataTestId('menu-selection'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const menuTestSuite: TestSuiteInfo<typeof menuScenePart> = {
  title: 'Angular Material v21 Menu',
  url: '/menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('MatMenu', () => {
      const engine = useTestEngine(menuScenePart, getTestEngine, { beforeEach, afterEach });

      test('has no panel in the DOM while closed', async () => {
        assertFalse(await engine().parts.accountMenu.exists());
      });

      describe('when the account menu is open', () => {
        beforeEach(async () => {
          await engine().parts.accountTrigger.click();
          await engine().parts.accountMenu.waitUntilComponentState({ condition: 'attached', timeoutMs: 5000 });
        });

        test('counts its items', async () => {
          assertEqual(await engine().parts.accountMenu.getMenuItemCount(), 3);
        });

        test('reads items by index', async () => {
          const first = await engine().parts.accountMenu.getMenuItemByIndex(0);
          assertEqual(await first?.label(), 'Profile');
          const outOfRange = await engine().parts.accountMenu.getMenuItemByIndex(99);
          assertEqual(outOfRange, null);
        });

        test('reads items by label, including disabled state', async () => {
          const logout = await engine().parts.accountMenu.getMenuItemByLabel('Logout');
          assertTrue(await logout?.isDisabled());
          const profile = await engine().parts.accountMenu.getMenuItemByLabel('Profile');
          assertFalse(await profile?.isDisabled());
          assertEqual(await engine().parts.accountMenu.getMenuItemByLabel('Missing'), null);
        });

        test('activating an item runs its handler and closes the menu', async () => {
          await engine().parts.accountMenu.selectByLabel('Settings');
          const selection = await engine().parts.accountMenu.waitUntil({
            probeFn: async () => (await engine().parts.selection.getText())?.trim(),
            terminateCondition: 'Settings',
            timeoutMs: 5000,
          });
          assertEqual(selection, 'Settings');
          // Material removes the panel once the exit animation finishes.
          const stillExists = await engine().parts.accountMenu.waitUntil({
            probeFn: () => engine().parts.accountMenu.exists(),
            terminateCondition: false,
            timeoutMs: 5000,
          });
          assertFalse(stillExists);
        });
      });

      test('each menu resolves its own panel', async () => {
        await engine().parts.sortTrigger.click();
        await engine().parts.sortMenu.waitUntilComponentState({ condition: 'attached', timeoutMs: 5000 });
        assertEqual(await engine().parts.sortMenu.getMenuItemCount(), 2);
        const first = await engine().parts.sortMenu.getMenuItemByIndex(0);
        assertEqual(await first?.label(), 'Newest');
        // The other menu's panel is not open, so it resolves to nothing.
        assertFalse(await engine().parts.accountMenu.exists());
      });
    });
  },
};
