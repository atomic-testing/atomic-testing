import { ChatToolCallsDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { chatToolCallsUIExample } from './ChatToolCalls.examples';

export const chatToolCallsExampleScenePart = {
  single: {
    locator: byDataTestId('tool-single'),
    driver: ChatToolCallsDriver,
  },
  multi: {
    locator: byDataTestId('tool-multi'),
    driver: ChatToolCallsDriver,
  },
} satisfies ScenePart;

export const chatToolCallsExample: IExampleUnit<typeof chatToolCallsExampleScenePart, JSX.Element> = {
  ...chatToolCallsUIExample,
  scene: chatToolCallsExampleScenePart,
};

export const chatToolCallsExampleTestSuite: TestSuiteInfo<typeof chatToolCallsExample.scene> = {
  title: 'Astryx ChatToolCalls',
  url: '/chat-tool-calls',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${chatToolCallsExample.title}`, () => {
      const engine = useTestEngine(chatToolCallsExample.scene, getTestEngine, { beforeEach, afterEach });

      // isGrouped distinguishes a single inline call from a multi-call group.
      test(`distinguishes single from group`, async () => {
        assertFalse(await engine().parts.single.isGrouped());
        assertTrue(await engine().parts.multi.isGrouped());
      });

      // getCallCount counts rows in both shapes; the group's rows stay in the DOM.
      test(`counts calls`, async () => {
        assertEqual(await engine().parts.single.getCallCount(), 1);
        assertEqual(await engine().parts.multi.getCallCount(), 4);
      });

      // isExpanded is undefined for a single call; a >3 group defaults to collapsed.
      test(`reports expanded state`, async () => {
        assertEqual(await engine().parts.single.isExpanded(), undefined);
        assertEqual(await engine().parts.multi.isExpanded(), false);
      });

      // toggleGroup flips the group header's aria-expanded.
      test(`toggles the group`, async () => {
        await engine().parts.multi.toggleGroup();
        assertTrue(await engine().parts.multi.isExpanded());
        await engine().parts.multi.toggleGroup();
        assertFalse(await engine().parts.multi.isExpanded());
      });
    });
  },
};
