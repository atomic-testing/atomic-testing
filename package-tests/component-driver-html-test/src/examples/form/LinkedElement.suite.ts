import { JSX } from 'react';

import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, byDataTestId, byLinkedElement } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
      const engine = useTestEngine(linkedElementExample.scene, getTestEngine, { beforeEach, afterEach });

      test('Can locate input matched by label for', async () => {
        const targetValue = 'Something';
        const val = await engine().parts.textInput.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
