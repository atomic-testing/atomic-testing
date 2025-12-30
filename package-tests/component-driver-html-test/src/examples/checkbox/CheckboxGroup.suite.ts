import { JSX } from 'react';

import { HTMLCheckboxGroupDriver } from '@atomic-testing/component-driver-html';
import { byName, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
      const engine = useTestEngine(checkboxGroupExample.scene, getTestEngine, { beforeEach, afterEach });

      describe('Initial state', () => {
        test('value should be empty array', async () => {
          const val = await engine().parts.toggles.getValue();
          assertEqual(val, []);
        });
      });

      describe('Upon setting selected to true', () => {
        beforeEach(async () => {
          await engine().parts.toggles.setValue(['2', '5']);
        });

        test('value should be the same as what were set', async () => {
          const val = await engine().parts.toggles.getValue();
          assertEqual(val, ['2', '5']);
        });
      });
    });
  },
};
