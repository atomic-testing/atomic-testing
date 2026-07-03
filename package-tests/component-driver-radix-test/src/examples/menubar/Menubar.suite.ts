import { MenubarDriver, MenubarMenuDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { menubarUIExample } from './Menubar.examples';

export const menubarExampleScenePart = {
  menubar: {
    locator: byDataTestId('menubar-root'),
    driver: MenubarDriver,
  },
  // Each menu is anchored at ITS OWN trigger — the per-instance handle a
  // multi-menu bar needs (see MenubarMenuDriver's class doc).
  fileMenu: {
    locator: byDataTestId('menubar-file-trigger'),
    driver: MenubarMenuDriver,
  },
  editMenu: {
    locator: byDataTestId('menubar-edit-trigger'),
    driver: MenubarMenuDriver,
  },
} satisfies ScenePart;

export const menubarExample: IExampleUnit<typeof menubarExampleScenePart, JSX.Element> = {
  ...menubarUIExample,
  scene: menubarExampleScenePart,
};

export const menubarExampleTestSuite: TestSuiteInfo<typeof menubarExample.scene> = {
  title: 'Radix Menubar',
  url: '/menubar',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${menubarExample.title}`, () => {
      const engine = useTestEngine(menubarExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads bar orientation and trigger count', async () => {
        assertEqual(await engine().parts.menubar.getOrientation(), 'horizontal');
        assertEqual(await engine().parts.menubar.getTriggerCount(), 2);
      });

      test('menus are not open initially', async () => {
        assertFalse(await engine().parts.fileMenu.isOpen());
        assertFalse(await engine().parts.editMenu.isOpen());
      });

      test('reads trigger labels', async () => {
        assertEqual(await engine().parts.fileMenu.getTriggerLabel(), 'File');
        assertEqual(await engine().parts.editMenu.getTriggerLabel(), 'Edit');
      });

      test('open() opens only the clicked menu', async () => {
        await engine().parts.fileMenu.open();
        await engine().parts.fileMenu.waitForOpen();
        assertTrue(await engine().parts.fileMenu.isOpen());
        assertFalse(await engine().parts.editMenu.isOpen());
      });

      // New, Open, [separator], Exit — same interspersed same-tag separator
      // shape as DropdownMenu; the childListHelper rationale on
      // MenuContentDriverBase.
      test('counts items, skipping the separator', async () => {
        await engine().parts.fileMenu.open();
        await engine().parts.fileMenu.waitForOpen();
        assertEqual(await engine().parts.fileMenu.getMenuItemCount(), 3);
      });

      test('finds an item by label past the separator', async () => {
        await engine().parts.fileMenu.open();
        await engine().parts.fileMenu.waitForOpen();
        const exit = await engine().parts.fileMenu.getMenuItemByLabel('Exit');
        assertTrue(exit != null);
        assertEqual(await exit?.getLabel(), 'Exit');
      });

      test('reports the disabled item as disabled', async () => {
        await engine().parts.fileMenu.open();
        await engine().parts.fileMenu.waitForOpen();
        const open = await engine().parts.fileMenu.getMenuItemByLabel('Open');
        assertTrue(await open?.isDisabled());
      });

      test('selectByLabel clicks the item and closes the menu', async () => {
        await engine().parts.fileMenu.open();
        await engine().parts.fileMenu.waitForOpen();
        await engine().parts.fileMenu.selectByLabel('New');
        await engine().parts.fileMenu.waitForClose();
        assertFalse(await engine().parts.fileMenu.isOpen());
      });

      test('close() closes the open menu via its trigger toggle', async () => {
        await engine().parts.fileMenu.open();
        await engine().parts.fileMenu.waitForOpen();
        await engine().parts.fileMenu.close();
        await engine().parts.fileMenu.waitForClose();
        assertFalse(await engine().parts.fileMenu.isOpen());
      });
    });
  },
};
