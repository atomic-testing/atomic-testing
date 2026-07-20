import { MessageBarDriver } from '@atomic-testing/component-driver-fluent-v9';
import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { messageBarUIExample } from './MessageBar.examples';

export const messageBarExampleScenePart = {
  titled: { locator: byDataTestId('message-bar-titled'), driver: MessageBarDriver },
  untitled: { locator: byDataTestId('message-bar-untitled'), driver: MessageBarDriver },
  dismiss: { locator: byDataTestId('message-bar-dismiss'), driver: HTMLButtonDriver },
} satisfies ScenePart;

export const messageBarExample: IExampleUnit<typeof messageBarExampleScenePart, JSX.Element> = {
  ...messageBarUIExample,
  scene: messageBarExampleScenePart,
};

export const messageBarExampleTestSuite: TestSuiteInfo<typeof messageBarExample.scene> = {
  title: 'Fluent MessageBar',
  url: '/message-bar',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${messageBarExample.title}`, () => {
      const engine = useTestEngine(messageBarExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads the title separately from the body', async () => {
        assertEqual(await engine().parts.titled.getTitle(), 'Heads up');
        assertEqual(await engine().parts.titled.getBodyText(), 'Heads upThis action cannot be undone.');
      });

      test('a message bar with no title reads its body text alone', async () => {
        assertEqual(await engine().parts.untitled.getTitle(), undefined);
        assertEqual(await engine().parts.untitled.getBodyText(), 'Saved successfully.');
      });

      test('the consumer-declared dismiss action is a plain button', async () => {
        assertEqual(await engine().parts.dismiss.getText(), 'Dismiss');
      });
    });
  },
};
