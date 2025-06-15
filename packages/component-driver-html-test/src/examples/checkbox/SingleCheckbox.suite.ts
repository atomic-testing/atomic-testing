import { JSX } from 'react';

import { HTMLCheckboxDriver } from '@atomic-testing/component-driver-html';
import { byName, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

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
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${singleCheckboxExample.title}`, () => {
      let testEngine: TestEngine<typeof singleCheckboxExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(singleCheckboxExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      describe('Initial state', () => {
        test('isSelected() should be false', async () => {
          const val = await testEngine.parts.toggle.isSelected();
          assertEqual(val, false);
        });
        test('value should be 1 regardless of its checked state', async () => {
          const val = await testEngine.parts.toggle.getValue();
          assertEqual(val, '1');
        });
      });

      describe('Upon setting selected to true', () => {
        beforeEach(async () => {
          await testEngine.parts.toggle.setSelected(true);
        });

        test('isSelected() should be true', async () => {
          const val = await testEngine.parts.toggle.isSelected();
          assertEqual(val, true);
        });
        test("value should be the checkbox's value", async () => {
          const val = await testEngine.parts.toggle.getValue();
          assertEqual(val, '1');
        });
      });
    });
  },
};
