import { ButtonDriver, InlineDrawerDriver, OverlayDrawerDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { drawerUIExample } from './Drawer.examples';

export const drawerExampleScenePart = {
  overlayTrigger: { locator: byDataTestId('overlay-drawer-trigger'), driver: ButtonDriver },
  overlayDrawer: { locator: byDataTestId('overlay-drawer'), driver: OverlayDrawerDriver },
  inlineToggle: { locator: byDataTestId('inline-drawer-toggle'), driver: ButtonDriver },
  inlineDrawer: { locator: byDataTestId('inline-drawer'), driver: InlineDrawerDriver },
} satisfies ScenePart;

export const drawerExample: IExampleUnit<typeof drawerExampleScenePart, JSX.Element> = {
  ...drawerUIExample,
  scene: drawerExampleScenePart,
};

export const drawerExampleTestSuite: TestSuiteInfo<typeof drawerExample.scene> = {
  title: 'Fluent Drawer',
  url: '/drawer',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe('Fluent Drawer', () => {
      const engine = useTestEngine(drawerExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('inline drawer renders in-tree and open by default', async () => {
        assertTrue(await engine().parts.inlineDrawer.isOpen());
        assertEqual(await engine().parts.inlineDrawer.getHeaderTitle(), 'Inline drawer title');
        assertEqual(await engine().parts.inlineDrawer.getBodyText(), 'Inline drawer body content');
      });

      test('inline drawer toggles closed', async () => {
        await engine().parts.inlineToggle.click();
        assertTrue(await engine().parts.inlineDrawer.waitForClose());
        assertFalse(await engine().parts.inlineDrawer.isOpen());
      });

      test('overlay drawer is not open initially', async () => {
        assertFalse(await engine().parts.overlayDrawer.isOpen());
      });

      test('overlay drawer opens via its trigger and reads header/body', async () => {
        await engine().parts.overlayTrigger.click();
        assertTrue(await engine().parts.overlayDrawer.waitForOpen());
        assertEqual(await engine().parts.overlayDrawer.getHeaderTitle(), 'Overlay drawer title');
        assertEqual(await engine().parts.overlayDrawer.getBodyText(), 'Overlay drawer body content');
      });

      test('overlay drawer closes via Escape', async () => {
        await engine().parts.overlayTrigger.click();
        await engine().parts.overlayDrawer.waitForOpen();
        assertTrue(await engine().parts.overlayDrawer.closeByEscape());
        assertFalse(await engine().parts.overlayDrawer.isOpen());
      });

      test('overlay and inline drawers do not cross-resolve (portalled vs in-tree)', async () => {
        await engine().parts.overlayTrigger.click();
        await engine().parts.overlayDrawer.waitForOpen();

        assertEqual(await engine().parts.overlayDrawer.getHeaderTitle(), 'Overlay drawer title');
        assertEqual(await engine().parts.inlineDrawer.getHeaderTitle(), 'Inline drawer title');
      });
    });
  },
};
