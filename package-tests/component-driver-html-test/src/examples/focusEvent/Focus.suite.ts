import { JSX } from 'react';

import { HTMLElementDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
      let testEngine: TestEngine<typeof focusEventExample.scene>;

      beforeEach(function ({ page }: TestFixture) {
        testEngine = getTestEngine(focusEventExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          (arguments[0] as () => void)();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`Initially detail is empty`, async () => {
        assertEqual(await testEngine.parts.detail.getText(), '');
      });

      test(`Detail is "focus" when element is focused`, async () => {
        await testEngine.parts.target.focus();
        assertEqual(await testEngine.parts.detail.getText(), 'focus');
      });

      test(`Detail is "blur" when element is blurred`, async () => {
        await testEngine.parts.target.focus();
        // Focus on another element to blur the target
        await testEngine.parts.blurAid.focus();
        assertEqual(await testEngine.parts.detail.getText(), 'blur');
      });
    });
  },
};
