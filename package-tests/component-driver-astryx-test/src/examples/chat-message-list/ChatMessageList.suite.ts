import { ChatMessageListDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { chatMessageListUIExample } from './ChatMessageList.examples';

export const chatMessageListExampleScenePart = {
  fullList: {
    locator: byDataTestId('list-full'),
    driver: ChatMessageListDriver,
  },
  emptyList: {
    locator: byDataTestId('list-empty'),
    driver: ChatMessageListDriver,
  },
} satisfies ScenePart;

export const chatMessageListExample: IExampleUnit<typeof chatMessageListExampleScenePart, JSX.Element> = {
  ...chatMessageListUIExample,
  scene: chatMessageListExampleScenePart,
};

export const chatMessageListExampleTestSuite: TestSuiteInfo<typeof chatMessageListExample.scene> = {
  title: 'Astryx ChatMessageList',
  url: '/chat-message-list',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${chatMessageListExample.title}`, () => {
      const engine = useTestEngine(chatMessageListExample.scene, getTestEngine, { beforeEach, afterEach });

      // getMessageCount counts the article rows; the empty list has none.
      test(`counts messages`, async () => {
        assertEqual(await engine().parts.fullList.getMessageCount(), 2);
        assertEqual(await engine().parts.emptyList.getMessageCount(), 0);
      });

      // The list items are ChatMessageDriver instances the driver can drive.
      test(`exposes message rows`, async () => {
        const first = await engine().parts.fullList.getItemByIndex(0);
        assertEqual(first != null ? await first.getSender() : undefined, 'user');
        const second = await engine().parts.fullList.getItemByIndex(1);
        assertEqual(second != null ? await second.getSender() : undefined, 'assistant');
      });

      // getDensity reads the stable data-density on the log root.
      test(`reads density`, async () => {
        assertEqual(await engine().parts.fullList.getDensity(), 'compact');
      });

      // getEmptyStateText reads the empty list's content, undefined when populated.
      test(`reads the empty state`, async () => {
        assertEqual(
          await engine().parts.emptyList.getEmptyStateText('[data-testid="list-empty-state"]'),
          'Start chatting!'
        );
        assertEqual(await engine().parts.fullList.getEmptyStateText('[data-testid="list-empty-state"]'), undefined);
      });
    });
  },
};
