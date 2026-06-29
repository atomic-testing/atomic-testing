import { ChatDictationButtonDriver } from '@atomic-testing/component-driver-astryx';
import { byCssSelector, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { chatDictationButtonUIExample } from './ChatDictationButton.examples';

export const chatDictationButtonExampleScenePart = {
  idle: {
    locator: byCssSelector('button[aria-label="Start dictation"]'),
    driver: ChatDictationButtonDriver,
  },
  listening: {
    locator: byCssSelector('button[aria-label="Stop dictation"]'),
    driver: ChatDictationButtonDriver,
  },
} satisfies ScenePart;

export const chatDictationButtonExample: IExampleUnit<typeof chatDictationButtonExampleScenePart, JSX.Element> = {
  ...chatDictationButtonUIExample,
  scene: chatDictationButtonExampleScenePart,
};

export const chatDictationButtonExampleTestSuite: TestSuiteInfo<typeof chatDictationButtonExample.scene> = {
  title: 'Astryx ChatDictationButton',
  url: '/chat-dictation-button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${chatDictationButtonExample.title}`, () => {
      const engine = useTestEngine(chatDictationButtonExample.scene, getTestEngine, { beforeEach, afterEach });

      // getAccessibleName reads the verbatim aria-label for each state.
      test(`reads the accessible name`, async () => {
        assertEqual(await engine().parts.idle.getAccessibleName(), 'Start dictation');
        assertEqual(await engine().parts.listening.getAccessibleName(), 'Stop dictation');
      });

      // isListening is true only for the "Stop dictation" state.
      test(`reports the listening state`, async () => {
        assertFalse(await engine().parts.idle.isListening());
        assertTrue(await engine().parts.listening.isListening());
      });
    });
  },
};
