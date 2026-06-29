import { ChatMessageDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { chatMessageUIExample } from './ChatMessage.examples';

export const chatMessageExampleScenePart = {
  userMessage: {
    locator: byDataTestId('msg-user'),
    driver: ChatMessageDriver,
  },
  assistantMessage: {
    locator: byDataTestId('msg-assistant'),
    driver: ChatMessageDriver,
  },
} satisfies ScenePart;

export const chatMessageExample: IExampleUnit<typeof chatMessageExampleScenePart, JSX.Element> = {
  ...chatMessageUIExample,
  scene: chatMessageExampleScenePart,
};

export const chatMessageExampleTestSuite: TestSuiteInfo<typeof chatMessageExample.scene> = {
  title: 'Astryx ChatMessage',
  url: '/chat-message',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${chatMessageExample.title}`, () => {
      const engine = useTestEngine(chatMessageExample.scene, getTestEngine, { beforeEach, afterEach });

      // getSender / getDensity read the stable data-* attributes on the article.
      test(`reads sender and density per message`, async () => {
        assertEqual(await engine().parts.userMessage.getSender(), 'user');
        assertEqual(await engine().parts.userMessage.getDensity(), 'compact');
        assertEqual(await engine().parts.assistantMessage.getSender(), 'assistant');
      });

      // getBubbleText returns just the bubble's text, isolated from name/metadata.
      test(`reads the bubble text`, async () => {
        assertEqual(await engine().parts.userMessage.getBubbleText(), 'Hey there!');
        assertEqual(await engine().parts.assistantMessage.getBubbleText(), 'How can I help?');
      });

      // getMetadataText reads the metadata block, and is undefined when absent.
      test(`reads metadata when present, undefined otherwise`, async () => {
        assertEqual(await engine().parts.userMessage.getMetadataText(), '2:30 PM');
        assertEqual(await engine().parts.assistantMessage.getMetadataText(), undefined);
      });
    });
  },
};
