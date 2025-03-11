import React from 'react';

import { HTMLCheckboxGroupDriver } from '@atomic-testing/component-driver-html';
import { byName, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

//#region Checkbox group
export const CheckboxGroup = () => {
  return (
    <React.Fragment>
      <form>
        <label>
          <input type='checkbox' name='checkbox-group' value='1' /> One
        </label>
        <br />
        <label>
          <input type='checkbox' name='checkbox-group' value='2' /> Two
        </label>
        <br />
        <label>
          <input type='checkbox' name='checkbox-group' value='3' /> Three
        </label>
        <br />
        <label>
          <input type='checkbox' name='checkbox-group' value='4' /> Four
        </label>
        <br />
        <label>
          <input type='checkbox' name='checkbox-group' value='5' /> Five
        </label>
        <br />
      </form>
    </React.Fragment>
  );
};

export const checkboxGroupScenePart = {
  toggles: {
    locator: byName('checkbox-group'),
    driver: HTMLCheckboxGroupDriver,
  },
} satisfies ScenePart;

export const checkboxGroupExample: IExampleUnit<typeof checkboxGroupScenePart, JSX.Element> = {
  title: 'Checkbox group',
  scene: checkboxGroupScenePart,
  ui: <CheckboxGroup />,
};
//#endregion

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
