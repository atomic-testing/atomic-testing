import { ChatLayoutDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { chatLayoutUIExample } from './ChatLayout.examples';

export const chatLayoutExampleScenePart = {
  compactLayout: {
    locator: byDataTestId('layout-compact'),
    driver: ChatLayoutDriver,
  },
  emptyLayout: {
    locator: byDataTestId('layout-empty'),
    driver: ChatLayoutDriver,
  },
} satisfies ScenePart;

export const chatLayoutExample: IExampleUnit<typeof chatLayoutExampleScenePart, JSX.Element> = {
  ...chatLayoutUIExample,
  scene: chatLayoutExampleScenePart,
};

export const chatLayoutExampleTestSuite: TestSuiteInfo<typeof chatLayoutExample.scene> = {
  title: 'Astryx ChatLayout',
  url: '/chat-layout',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${chatLayoutExample.title}`, () => {
      const engine = useTestEngine(chatLayoutExample.scene, getTestEngine, { beforeEach, afterEach });

      // getDensity reads the stable data-density on the layout root.
      test(`reads density`, async () => {
        assertEqual(await engine().parts.compactLayout.getDensity(), 'compact');
      });

      // getEmptyStateText reads the empty layout's content, undefined when populated.
      test(`reads the empty state`, async () => {
        assertEqual(
          await engine().parts.emptyLayout.getEmptyStateText('[data-testid="layout-empty-state"]'),
          'No messages'
        );
        assertEqual(
          await engine().parts.compactLayout.getEmptyStateText('[data-testid="layout-empty-state"]'),
          undefined
        );
      });
    });
  },
};
