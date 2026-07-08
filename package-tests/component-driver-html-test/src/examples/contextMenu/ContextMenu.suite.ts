import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { contextMenuUIExample } from './ContextMenu.examples';

export const contextMenuExampleScenePart = {
  contextTarget: {
    locator: byDataTestId('context-target'),
    driver: HTMLElementDriver,
  },
  contextMenu: {
    locator: byDataTestId('context-menu'),
    driver: HTMLElementDriver,
  },
  contextCount: {
    locator: byDataTestId('context-count'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const contextMenuExample: IExampleUnit<typeof contextMenuExampleScenePart, JSX.Element> = {
  ...contextMenuUIExample,
  scene: contextMenuExampleScenePart,
};

export const contextMenuExampleTestSuite: TestSuiteInfo<typeof contextMenuExample.scene> = {
  title: 'Context Menu: contextMenu',
  url: '/context-menu',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${contextMenuExample.title}`, () => {
      const engine = useTestEngine(contextMenuExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`Initially the count is zero and the menu does not exist`, async () => {
        assertEqual(await engine().parts.contextCount.getText(), '0');
        assertEqual(await engine().parts.contextMenu.exists(), false);
      });

      test(`contextMenu fires the contextmenu event and reveals the menu`, async () => {
        await engine().interactor.contextMenu(engine().parts.contextTarget.locator);
        // Poll the count for e2e robustness: the browser right-click and the
        // React re-render it triggers are asynchronous.
        const count = await engine().parts.contextCount.waitUntil({
          probeFn: () => engine().parts.contextCount.getText(),
          terminateCondition: '1',
          timeoutMs: 2000,
        });
        assertEqual(count, '1');
        assertEqual(await engine().parts.contextMenu.exists(), true);
      });
    });
  },
};
