import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ButtonDriver, DrawerDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicDrawerUIExample } from './BasicDrawer.example';

const drawerContentPart = {
  content: {
    locator: byDataTestId('drawer-content'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const basicDrawerExampleScenePart = {
  openTrigger: {
    locator: byDataTestId('open-drawer'),
    driver: ButtonDriver,
  },
  drawer: {
    locator: byDataTestId('basic-drawer'),
    driver: DrawerDriver<typeof drawerContentPart>,
    option: {
      content: drawerContentPart,
    },
  },
} satisfies ScenePart;

export const basicDrawerExample: IExampleUnit<typeof basicDrawerExampleScenePart, JSX.Element> = {
  ...basicDrawerUIExample,
  scene: basicDrawerExampleScenePart,
};

export const basicDrawerTestSuite: TestSuiteInfo<typeof basicDrawerExampleScenePart> = {
  title: 'Basic Drawer',
  url: '/drawer',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(basicDrawerExample.scene, getTestEngine, { beforeEach, afterEach });

    test('is closed initially', async () => {
      assertFalse(await engine().parts.drawer.isOpen());
    });

    test('opens when the trigger is clicked', async () => {
      await engine().parts.openTrigger.click();
      assertTrue(await engine().parts.drawer.waitForOpen());
      assertTrue(await engine().parts.drawer.isOpen());
    });

    test('reports its anchor when open', async () => {
      await engine().parts.openTrigger.click();
      await engine().parts.drawer.waitForOpen();
      assertEqual(await engine().parts.drawer.getAnchor(), 'left');
    });

    test('exposes its content when open', async () => {
      await engine().parts.openTrigger.click();
      await engine().parts.drawer.waitForOpen();
      assertTrue(await engine().parts.drawer.content.content.exists());
    });

    test('closes when the backdrop is clicked', async () => {
      await engine().parts.openTrigger.click();
      await engine().parts.drawer.waitForOpen();
      assertTrue(await engine().parts.drawer.closeByBackdrop());
      assertFalse(await engine().parts.drawer.isOpen());
    });

    test('reports no anchor when closed', async () => {
      assertEqual(await engine().parts.drawer.getAnchor(), undefined);
    });
  },
};
