import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ContextMenuDriver, MenuItemNotFoundErrorId } from '@atomic-testing/component-driver-primevue-v4';
import { byCssSelector, byDataTestId, childListHelper, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

export const contextMenuScenePart = {
  target: {
    locator: byDataTestId('context-target'),
    driver: ContextMenuDriver,
  },
  lastAction: {
    locator: byDataTestId('last-action'),
    driver: HTMLElementDriver,
  },
  secondTarget: {
    locator: byDataTestId('second-context-target'),
    driver: ContextMenuDriver,
  },
} satisfies ScenePart;

export const contextMenuTestSuite: TestSuiteInfo<typeof contextMenuScenePart> = {
  title: 'PrimeVue ContextMenu',
  url: '/context-menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('PrimeVue ContextMenu', () => {
      const engine = useTestEngine(contextMenuScenePart, getTestEngine, { beforeEach, afterEach });

      test('is closed initially and opens on a right-click of its trigger', async () => {
        assertFalse(await engine().parts.target.isOpen());
        await engine().parts.target.open();
        assertTrue(await engine().parts.target.waitForOpen());
      });

      test('counts every item across the separator', async () => {
        await engine().parts.target.open();
        await engine().parts.target.waitForOpen();
        assertEqual(await engine().parts.target.getMenuItemCount(), 3);
      });

      test('reads items by index, skipping the separator without losing count', async () => {
        await engine().parts.target.open();
        await engine().parts.target.waitForOpen();
        assertEqual(await (await engine().parts.target.getMenuItemByIndex(0))?.getLabel(), 'Copy');
        assertEqual(await (await engine().parts.target.getMenuItemByIndex(2))?.getLabel(), 'Delete');
        assertEqual(await engine().parts.target.getMenuItemByIndex(3), null);
      });

      test('reads the disabled item', async () => {
        await engine().parts.target.open();
        await engine().parts.target.waitForOpen();
        const deleteItem = await engine().parts.target.getMenuItemByLabel('Delete');
        assertTrue(await deleteItem?.isDisabled());
        const copyItem = await engine().parts.target.getMenuItemByLabel('Copy');
        assertFalse(await copyItem?.isDisabled());
      });

      test('activating an item runs its command and closes the menu', async () => {
        await engine().parts.target.open();
        await engine().parts.target.waitForOpen();
        await engine().parts.target.selectByLabel('Paste');
        assertTrue(await engine().parts.target.waitForClose());
        assertEqual(await engine().parts.lastAction.getText(), 'paste');
      });

      test('selectByLabel throws MenuItemNotFoundError for an unknown label', async () => {
        await engine().parts.target.open();
        await engine().parts.target.waitForOpen();
        let errorName = '';
        try {
          await engine().parts.target.selectByLabel('Rename');
        } catch (error) {
          errorName = (error as Error).name;
        }
        assertEqual(errorName, MenuItemNotFoundErrorId);
      });

      test('closeByEscape dismisses the open menu', async () => {
        await engine().parts.target.open();
        await engine().parts.target.waitForOpen();
        assertTrue(await engine().parts.target.closeByEscape());
        assertFalse(await engine().parts.target.isOpen());
      });

      test('a second, independent trigger opens its own menu with its own items (#1036)', async () => {
        assertFalse(await engine().parts.secondTarget.isOpen());
        await engine().parts.secondTarget.open();
        assertTrue(await engine().parts.secondTarget.waitForOpen());
        assertEqual(await engine().parts.secondTarget.getMenuItemCount(), 2);
        await engine().parts.secondTarget.selectByLabel('Rename');
        assertTrue(await engine().parts.secondTarget.waitForClose());
      });

      test('opening a second trigger while the first is still open does not no-op (review regression)', async () => {
        await engine().parts.target.open();
        assertTrue(await engine().parts.target.waitForOpen());

        // The bug: open() used to guard on isOpen(), which reads the
        // document-rooted, non-instance-scoped surface locator — so with
        // target's menu already open, secondTarget.open() would silently
        // skip dispatching the right-click, and only one surface would ever
        // mount. Count mounted surfaces directly (order-independent, unlike
        // reading either driver's own generic locator) rather than relying
        // on which one a single-match read happens to resolve to.
        await engine().parts.secondTarget.open();
        const mountedSurfaceCount = await childListHelper.countMatchingChildren(
          engine().interactor,
          byCssSelector('body', 'Root'),
          '[data-pc-name="contextmenu"]'
        );
        assertEqual(mountedSurfaceCount, 2);
      });
    });
  },
};
