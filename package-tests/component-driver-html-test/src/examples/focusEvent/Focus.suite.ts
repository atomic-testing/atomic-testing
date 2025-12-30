import { JSX } from 'react';

import { HTMLElementDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { focusEventUIExample } from './Focus.examples';

export const focusEventExampleScenePart = {
  target: {
    locator: byDataTestId('focus-target'),
    driver: HTMLTextInputDriver,
  },
  blurAid: {
    locator: byDataTestId('blur-aid'),
    driver: HTMLTextInputDriver,
  },
  detail: {
    locator: byDataTestId('focus-detail'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const focusEventExample: IExampleUnit<typeof focusEventExampleScenePart, JSX.Element> = {
  ...focusEventUIExample,
  scene: focusEventExampleScenePart,
};

export const focusEventExampleTestSuite: TestSuiteInfo<typeof focusEventExample.scene> = {
  title: 'Focus Event: Focus',
  url: '/focus-event',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${focusEventExample.title}`, () => {
      const engine = useTestEngine(focusEventExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`Initially detail is empty`, async () => {
        assertEqual(await engine().parts.detail.getText(), '');
      });

      test(`Detail is "focus" when element is focused`, async () => {
        await engine().parts.target.focus();
        assertEqual(await engine().parts.detail.getText(), 'focus');
      });

      test(`Detail is "blur" when element is blurred`, async () => {
        await engine().parts.target.focus();
        // Focus on another element to blur the target
        await engine().parts.blurAid.focus();
        assertEqual(await engine().parts.detail.getText(), 'blur');
      });
    });
  },
};
