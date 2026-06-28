import { HTMLElementDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { keyboardEventUIExample } from './KeyboardEvent.examples';

export const keyboardEventExampleScenePart = {
  target: {
    locator: byDataTestId('key-target'),
    driver: HTMLTextInputDriver,
  },
  detail: {
    locator: byDataTestId('key-detail'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const keyboardEventExample: IExampleUnit<typeof keyboardEventExampleScenePart, JSX.Element> = {
  ...keyboardEventUIExample,
  scene: keyboardEventExampleScenePart,
};

export const keyboardEventExampleTestSuite: TestSuiteInfo<typeof keyboardEventExample.scene> = {
  title: 'Keyboard Event: pressKey',
  url: '/keyboard-event',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${keyboardEventExample.title}`, () => {
      const engine = useTestEngine(keyboardEventExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`Initially detail is empty`, async () => {
        assertEqual(await engine().parts.detail.getText(), '');
      });

      test(`pressKey('Escape') reports the Escape key`, async () => {
        await engine().parts.target.pressKey('Escape');
        assertEqual(await engine().parts.detail.getText(), 'Escape');
      });

      test(`pressKey('Backspace') reports the Backspace key`, async () => {
        await engine().parts.target.pressKey('Backspace');
        assertEqual(await engine().parts.detail.getText(), 'Backspace');
      });

      test(`pressKey('Enter') reports the Enter key`, async () => {
        await engine().parts.target.pressKey('Enter');
        assertEqual(await engine().parts.detail.getText(), 'Enter');
      });
    });
  },
};
