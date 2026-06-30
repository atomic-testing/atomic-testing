import { ChatSystemMessageDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { chatSystemMessageUIExample } from './ChatSystemMessage.examples';

export const chatSystemMessageExampleScenePart = {
  defaultMessage: {
    locator: byDataTestId('sys-default'),
    driver: ChatSystemMessageDriver,
  },
  dividerMessage: {
    locator: byDataTestId('sys-divider'),
    driver: ChatSystemMessageDriver,
  },
} satisfies ScenePart;

export const chatSystemMessageExample: IExampleUnit<typeof chatSystemMessageExampleScenePart, JSX.Element> = {
  ...chatSystemMessageUIExample,
  scene: chatSystemMessageExampleScenePart,
};

export const chatSystemMessageExampleTestSuite: TestSuiteInfo<typeof chatSystemMessageExample.scene> = {
  title: 'Astryx ChatSystemMessage',
  url: '/chat-system-message',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${chatSystemMessageExample.title}`, () => {
      const engine = useTestEngine(chatSystemMessageExample.scene, getTestEngine, { beforeEach, afterEach });

      // getText reads the system notice's content.
      test(`reads message text`, async () => {
        assertEqual(await engine().parts.defaultMessage.getText(), 'Conversation started');
        assertEqual(await engine().parts.dividerMessage.getText(), 'Today');
      });

      // getVariant distinguishes the default from the divider variant.
      test(`reads variant`, async () => {
        assertEqual(await engine().parts.defaultMessage.getVariant(), 'default');
        assertEqual(await engine().parts.dividerMessage.getVariant(), 'divider');
      });
    });
  },
};
