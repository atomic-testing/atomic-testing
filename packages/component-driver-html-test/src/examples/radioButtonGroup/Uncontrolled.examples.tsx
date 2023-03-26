import { HTMLRadioButtonGroupDriver } from '@atomic-testing/component-driver-html';
import { byName, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import React from 'react';

//#region Uncontrolled radio button group example
export const UncontrolledRadioButtonGroupExample = () => {
  return (
    <React.Fragment>
      <form>
        <label>
          <input type="radio" name="uncontrolled-group" value="1" /> One
        </label>
        <br />
        <label>
          <input type="radio" name="uncontrolled-group" value="2" /> Two
        </label>
        <br />
        <label>
          <input type="radio" name="uncontrolled-group" value="3" /> Three
        </label>
      </form>
    </React.Fragment>
  );
};

export const uncontrolledRadioButtonGroupExampleScenePart = {
  input: {
    locator: byName('uncontrolled-group'),
    driver: HTMLRadioButtonGroupDriver,
  },
} satisfies ScenePart;

export const uncontrolledRadioButtonGroupExample: IExampleUnit<
  typeof uncontrolledRadioButtonGroupExampleScenePart,
  JSX.Element
> = {
  title: 'Uncontrolled radio button group',
  scene: uncontrolledRadioButtonGroupExampleScenePart,
  ui: <UncontrolledRadioButtonGroupExample />,
};
//#endregion

export const uncontrolledRadioButtonGroupTestSuite: TestSuiteInfo<typeof uncontrolledRadioButtonGroupExample.scene> = {
  title: 'Radio Button Group',
  url: '/radio-buttons',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${uncontrolledRadioButtonGroupExample.title}`, () => {
      let testEngine: TestEngine<typeof uncontrolledRadioButtonGroupExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(uncontrolledRadioButtonGroupExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('should be able to select a radio button', async () => {
        const targetValue = '3';
        await testEngine.parts.input.setValue(targetValue);
        const val = await testEngine.parts.input.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
