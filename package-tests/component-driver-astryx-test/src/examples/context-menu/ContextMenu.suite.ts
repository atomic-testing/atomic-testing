import { ContextMenuDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { contextMenuUIExample } from './ContextMenu.examples';

export const contextMenuExampleScenePart = {
  ctxMenu: {
    locator: byDataTestId('ctx-menu'),
    driver: ContextMenuDriver,
  },
} satisfies ScenePart;

export const contextMenuExample: IExampleUnit<typeof contextMenuExampleScenePart, JSX.Element> = {
  ...contextMenuUIExample,
  scene: contextMenuExampleScenePart,
};

export const contextMenuExampleTestSuite: TestSuiteInfo<typeof contextMenuExample.scene> = {
  title: 'Astryx ContextMenu',
  url: '/context-menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${contextMenuExample.title}`, () => {
      const engine = useTestEngine(contextMenuExample.scene, getTestEngine, { beforeEach, afterEach });

      // Items stay mounted in the DOM while closed, so labels/count read in jsdom.
      // Open-state is intentionally NOT asserted — it is E2E-only (native popover).
      test(`getItemLabels reads every menu item in order`, async () => {
        assertEqual(await engine().parts.ctxMenu.getItemLabels(), ['Cut', 'Copy', 'Paste']);
      });

      test(`getItemCount counts the menu items`, async () => {
        assertEqual(await engine().parts.ctxMenu.getItemCount(), 3);
      });
    });
  },
};
