import { JSX } from 'react';

import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId, byLinkedElement } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

import { linkedElementUIExample } from './LinkedElement.examples';

export const linkedElementExampleScenePart = {
  textInput: {
    locator: byLinkedElement()
      .onLinkedElement(byDataTestId('input-label'))
      .extractAttribute('for')
      .toMatchMyAttribute('id'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export const linkedElementExample: IExampleUnit<typeof linkedElementExampleScenePart, JSX.Element> = {
  ...linkedElementUIExample,
  scene: linkedElementExampleScenePart,
};

export const linkedElementTestSuite: TestSuiteInfo<typeof linkedElementExample.scene> = {
  title: 'Linked Element',
  url: '/form',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${linkedElementExample.title}`, () => {
      let testEngine: TestEngine<typeof linkedElementExample.scene>;

      beforeEach(function ({ page }: TestFixture) {
        testEngine = getTestEngine(linkedElementExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          (arguments[0] as () => void)();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Can locate input matched by label for', async () => {
        const targetValue = 'Something';
        const val = await testEngine.parts.textInput.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
