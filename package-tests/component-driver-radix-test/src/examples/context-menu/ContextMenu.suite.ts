import { ContextMenuDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { contextMenuUIExample } from './ContextMenu.examples';

export const contextMenuExampleScenePart = {
  // ContextMenuDriver is anchored at the TRIGGER — the bare span is the only
  // element carrying per-instance state (data-state), and right-click is the
  // only open gesture (see the driver doc).
  menu: {
    locator: byDataTestId('context-menu-trigger'),
    driver: ContextMenuDriver,
  },
} satisfies ScenePart;

export const contextMenuExample: IExampleUnit<typeof contextMenuExampleScenePart, JSX.Element> = {
  ...contextMenuUIExample,
  scene: contextMenuExampleScenePart,
};

export const contextMenuExampleTestSuite: TestSuiteInfo<typeof contextMenuExample.scene> = {
  title: 'Radix ContextMenu',
  url: '/context-menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${contextMenuExample.title}`, () => {
      const engine = useTestEngine(contextMenuExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('is not open initially', async () => {
        assertFalse(await engine().parts.menu.isOpen());
      });

      test('open() right-clicks the trigger and opens the menu', async () => {
        await engine().parts.menu.open();
        await engine().parts.menu.waitForOpen();
        assertTrue(await engine().parts.menu.isOpen());
      });

      // Copy, Paste, [separator], Delete — the separator is a same-tag <div>,
      // the childListHelper rationale on MenuContentDriverBase.
      test('counts items, skipping the separator', async () => {
        await engine().parts.menu.open();
        await engine().parts.menu.waitForOpen();
        assertEqual(await engine().parts.menu.getMenuItemCount(), 3);
      });

      test('finds an item by label past the separator', async () => {
        await engine().parts.menu.open();
        await engine().parts.menu.waitForOpen();
        const item = await engine().parts.menu.getMenuItemByLabel('Delete');
        assertTrue(item != null);
        assertEqual(await item?.getLabel(), 'Delete');
      });

      test('reports the disabled item as disabled', async () => {
        await engine().parts.menu.open();
        await engine().parts.menu.waitForOpen();
        const paste = await engine().parts.menu.getMenuItemByLabel('Paste');
        assertTrue(await paste?.isDisabled());
      });

      test('selectByLabel clicks the item and closes the menu', async () => {
        await engine().parts.menu.open();
        await engine().parts.menu.waitForOpen();
        await engine().parts.menu.selectByLabel('Copy');
        await engine().parts.menu.waitForClose();
        assertFalse(await engine().parts.menu.isOpen());
      });

      test('pressing Escape closes the menu', async () => {
        await engine().parts.menu.open();
        await engine().parts.menu.waitForOpen();
        const closed = await engine().parts.menu.closeByEscape();
        assertTrue(closed);
        assertFalse(await engine().parts.menu.isOpen());
      });
    });
  },
};
