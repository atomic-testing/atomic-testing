import { ChatMessageBubbleDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { chatMessageBubbleUIExample } from './ChatMessageBubble.examples';

export const chatMessageBubbleExampleScenePart = {
  userBubble: {
    locator: byDataTestId('bubble-user'),
    driver: ChatMessageBubbleDriver,
  },
  standaloneBubble: {
    locator: byDataTestId('bubble-standalone'),
    driver: ChatMessageBubbleDriver,
  },
  ghostBubble: {
    locator: byDataTestId('bubble-ghost'),
    driver: ChatMessageBubbleDriver,
  },
} satisfies ScenePart;

export const chatMessageBubbleExample: IExampleUnit<typeof chatMessageBubbleExampleScenePart, JSX.Element> = {
  ...chatMessageBubbleUIExample,
  scene: chatMessageBubbleExampleScenePart,
};

export const chatMessageBubbleExampleTestSuite: TestSuiteInfo<typeof chatMessageBubbleExample.scene> = {
  title: 'Astryx ChatMessageBubble',
  url: '/chat-message-bubble',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${chatMessageBubbleExample.title}`, () => {
      const engine = useTestEngine(chatMessageBubbleExample.scene, getTestEngine, { beforeEach, afterEach });

      // getText reads the bubble's content.
      test(`reads bubble text`, async () => {
        assertEqual(await engine().parts.userBubble.getText(), 'Hey there!');
        assertEqual(await engine().parts.standaloneBubble.getText(), 'Standalone reply');
      });

      // getSender reflects the enclosing message context, defaulting to assistant standalone.
      test(`reads sender from context`, async () => {
        assertEqual(await engine().parts.userBubble.getSender(), 'user');
        assertEqual(await engine().parts.standaloneBubble.getSender(), 'assistant');
      });

      // getVariant distinguishes the filled default from the ghost variant.
      test(`reads variant`, async () => {
        assertEqual(await engine().parts.standaloneBubble.getVariant(), 'filled');
        assertEqual(await engine().parts.ghostBubble.getVariant(), 'ghost');
      });
    });
  },
};
