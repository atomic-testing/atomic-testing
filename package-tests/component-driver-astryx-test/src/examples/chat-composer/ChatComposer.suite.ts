import { ChatComposerDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { chatComposerUIExample } from './ChatComposer.examples';

export const chatComposerExampleScenePart = {
  ccIdle: {
    locator: byDataTestId('cc-idle'),
    driver: ChatComposerDriver,
  },
  ccStop: {
    locator: byDataTestId('cc-stop'),
    driver: ChatComposerDriver,
  },
} satisfies ScenePart;

export const chatComposerExample: IExampleUnit<typeof chatComposerExampleScenePart, JSX.Element> = {
  ...chatComposerUIExample,
  scene: chatComposerExampleScenePart,
};

export const chatComposerExampleTestSuite: TestSuiteInfo<typeof chatComposerExample.scene> = {
  title: 'Astryx ChatComposer',
  url: '/chat-composer',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${chatComposerExample.title}`, () => {
      const engine = useTestEngine(chatComposerExample.scene, getTestEngine, { beforeEach, afterEach });

      // Density reflects onto data-density (default 'balanced').
      test(`getDensity reads the default density`, async () => {
        assertEqual(await engine().parts.ccIdle.getDensity(), 'balanced');
      });

      // The send button is disabled while the editor is empty.
      test(`canSend is false for the empty idle composer`, async () => {
        assertFalse(await engine().parts.ccIdle.canSend());
      });

      // The stop variant flips the button's aria-label to "Stop".
      test(`isStopShown reads the stop-button state`, async () => {
        assertTrue(await engine().parts.ccStop.isStopShown());
        assertFalse(await engine().parts.ccIdle.isStopShown());
      });

      // The status message reads off the role="alert" element when present.
      test(`getStatusMessage reads the status, undefined when absent`, async () => {
        assertEqual(await engine().parts.ccStop.getStatusMessage(), 'Connection lost');
        assertEqual(await engine().parts.ccIdle.getStatusMessage(), undefined);
      });
    });
  },
};
