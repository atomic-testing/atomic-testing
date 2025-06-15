import { JSX } from 'react';

import { HTMLCheckboxGroupDriver } from '@atomic-testing/component-driver-html';
import { byName, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

import { checkboxGroupUIExample } from './CheckboxGroup.examples';

export const checkboxGroupScenePart = {
  toggles: {
    locator: byName('checkbox-group'),
    driver: HTMLCheckboxGroupDriver,
  },
} satisfies ScenePart;

export const checkboxGroupExample: IExampleUnit<typeof checkboxGroupScenePart, JSX.Element> = {
  ...checkboxGroupUIExample,
  scene: checkboxGroupScenePart,
};

export const checkboxGroupTestSuite: TestSuiteInfo<typeof checkboxGroupExample.scene> = {
  title: 'Checkbox group',
  url: '/checkbox',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${checkboxGroupExample.title}`, () => {
      let testEngine: TestEngine<typeof checkboxGroupExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(checkboxGroupExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      describe('Initial state', () => {
        test('value should be empty array', async () => {
          const val = await testEngine.parts.toggles.getValue();
          assertEqual(val, []);
        });
      });

      describe('Upon setting selected to true', () => {
        beforeEach(async () => {
          await testEngine.parts.toggles.setValue(['2', '5']);
        });

        test('value should be the same as what were set', async () => {
          const val = await testEngine.parts.toggles.getValue();
          assertEqual(val, ['2', '5']);
        });
      });
    });
  },
};
