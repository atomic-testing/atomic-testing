import { JSX } from 'react';

import { HTMLCheckboxDriver } from '@atomic-testing/component-driver-html';
import { byName, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { singleCheckboxUIExample } from './SingleCheckbox.examples';

export const singleCheckboxScenePart = {
  toggle: {
    locator: byName('single-checkbox'),
    driver: HTMLCheckboxDriver,
  },
} satisfies ScenePart;

export const singleCheckboxExample: IExampleUnit<typeof singleCheckboxScenePart, JSX.Element> = {
  ...singleCheckboxUIExample,
  scene: singleCheckboxScenePart,
};

export const singleCheckboxTestSuite: TestSuiteInfo<typeof singleCheckboxExample.scene> = {
  title: 'Single checkbox',
  url: '/checkbox',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${singleCheckboxExample.title}`, () => {
      const engine = useTestEngine(singleCheckboxExample.scene, getTestEngine, { beforeEach, afterEach });

      describe('Initial state', () => {
        test('isSelected() should be false', async () => {
          const val = await engine().parts.toggle.isSelected();
          assertFalse(val);
        });
        test('value should be 1 regardless of its checked state', async () => {
          const val = await engine().parts.toggle.getValue();
          assertEqual(val, '1');
        });
      });

      describe('Upon setting selected to true', () => {
        beforeEach(async () => {
          await engine().parts.toggle.setSelected(true);
        });

        test('isSelected() should be true', async () => {
          const val = await engine().parts.toggle.isSelected();
          assertTrue(val);
        });
        test("value should be the checkbox's value", async () => {
          const val = await engine().parts.toggle.getValue();
          assertEqual(val, '1');
        });
      });
    });
  },
};
