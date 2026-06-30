import { ChatComposerInputDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { chatComposerInputUIExample } from './ChatComposerInput.examples';

export const chatComposerInputExampleScenePart = {
  cci: {
    locator: byDataTestId('cci'),
    driver: ChatComposerInputDriver,
  },
} satisfies ScenePart;

export const chatComposerInputExample: IExampleUnit<typeof chatComposerInputExampleScenePart, JSX.Element> = {
  ...chatComposerInputUIExample,
  scene: chatComposerInputExampleScenePart,
};

export const chatComposerInputExampleTestSuite: TestSuiteInfo<typeof chatComposerInputExample.scene> = {
  title: 'Astryx ChatComposerInput',
  url: '/chat-composer-input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse }) => {
    describe(`${chatComposerInputExample.title}`, () => {
      const engine = useTestEngine(chatComposerInputExample.scene, getTestEngine, { beforeEach, afterEach });

      // The accessible name reads off the contenteditable's aria-label.
      test(`getLabel reads the accessible name`, async () => {
        assertEqual(await engine().parts.cci.getLabel(), 'Message input');
      });

      // The placeholder is an aria-hidden sibling, read in jsdom.
      test(`getPlaceholder reads the placeholder sibling`, async () => {
        assertEqual(await engine().parts.cci.getPlaceholder(), 'Type a message…');
      });

      // The trigger/suggestion menu starts closed; the open transition is E2E-only.
      test(`isSuggestionsOpen is false at rest`, async () => {
        assertFalse(await engine().parts.cci.isSuggestionsOpen());
      });
    });
  },
};
