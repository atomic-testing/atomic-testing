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
  modifiers: {
    locator: byDataTestId('key-modifiers'),
    driver: HTMLElementDriver,
  },
  plainEnterCount: {
    locator: byDataTestId('plain-enter-count'),
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

      test(`pressKey with no modifiers reports no modifiers`, async () => {
        await engine().parts.target.pressKey('Enter');
        assertEqual(await engine().parts.modifiers.getText(), '');
      });

      test(`pressKey('Enter', { ctrl: true }) reports the ctrl modifier`, async () => {
        await engine().parts.target.pressKey('Enter', { ctrl: true });
        assertEqual(await engine().parts.detail.getText(), 'Enter');
        assertEqual(await engine().parts.modifiers.getText(), 'ctrl');
      });

      test(`pressKey('ArrowDown', { shift: true }) reports the shift modifier`, async () => {
        await engine().parts.target.pressKey('ArrowDown', { shift: true });
        assertEqual(await engine().parts.detail.getText(), 'ArrowDown');
        assertEqual(await engine().parts.modifiers.getText(), 'shift');
      });

      test(`pressKey('Enter', { ctrl: true, shift: true }) reports both modifiers in order`, async () => {
        await engine().parts.target.pressKey('Enter', { ctrl: true, shift: true });
        assertEqual(await engine().parts.modifiers.getText(), 'ctrl,shift');
      });

      // Negative case: a plain-Enter handler (e.g. submit-on-Enter) must NOT fire
      // when Shift is held — Shift+Enter is a newline, not a submit.
      test(`pressKey('Enter', { shift: true }) does NOT trigger the plain-Enter handler`, async () => {
        assertEqual(await engine().parts.plainEnterCount.getText(), '0');
        await engine().parts.target.pressKey('Enter', { shift: true });
        assertEqual(await engine().parts.plainEnterCount.getText(), '0');
        // A subsequent unmodified Enter does fire it, proving the guard is the modifier.
        await engine().parts.target.pressKey('Enter');
        assertEqual(await engine().parts.plainEnterCount.getText(), '1');
      });
    });
  },
};
