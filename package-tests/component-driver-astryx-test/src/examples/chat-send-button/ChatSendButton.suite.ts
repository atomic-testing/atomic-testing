import { ChatSendButtonDriver } from '@atomic-testing/component-driver-astryx';
import { byCssSelector, byDataTestId, IExampleUnit, locatorUtil, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { chatSendButtonUIExample } from './ChatSendButton.examples';

// ChatSendButton forwards no testid, so each button is reached as the
// `astryx-chat-send-button` descendant of its testid'd wrapper.
const sendButtonIn = (wrapperTestId: string) =>
  locatorUtil.append(byDataTestId(wrapperTestId), byCssSelector('.astryx-chat-send-button'));

export const chatSendButtonExampleScenePart = {
  enabledSend: {
    locator: sendButtonIn('send-enabled'),
    driver: ChatSendButtonDriver,
  },
  disabledSend: {
    locator: sendButtonIn('send-disabled'),
    driver: ChatSendButtonDriver,
  },
  stop: {
    locator: sendButtonIn('send-stop'),
    driver: ChatSendButtonDriver,
  },
} satisfies ScenePart;

export const chatSendButtonExample: IExampleUnit<typeof chatSendButtonExampleScenePart, JSX.Element> = {
  ...chatSendButtonUIExample,
  scene: chatSendButtonExampleScenePart,
};

export const chatSendButtonExampleTestSuite: TestSuiteInfo<typeof chatSendButtonExample.scene> = {
  title: 'Astryx ChatSendButton',
  url: '/chat-send-button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertTrue, assertFalse }) => {
    describe(`${chatSendButtonExample.title}`, () => {
      const engine = useTestEngine(chatSendButtonExample.scene, getTestEngine, { beforeEach, afterEach });

      // isSend / isStop distinguish the two states via the verbatim aria-label.
      test(`distinguishes send from stop`, async () => {
        assertTrue(await engine().parts.enabledSend.isSend());
        assertFalse(await engine().parts.enabledSend.isStop());
        assertTrue(await engine().parts.stop.isStop());
        assertFalse(await engine().parts.stop.isSend());
      });

      // isDisabled reads the native disabled attribute on the send state.
      test(`reads the disabled state`, async () => {
        assertFalse(await engine().parts.enabledSend.isDisabled());
        assertTrue(await engine().parts.disabledSend.isDisabled());
      });
    });
  },
};
