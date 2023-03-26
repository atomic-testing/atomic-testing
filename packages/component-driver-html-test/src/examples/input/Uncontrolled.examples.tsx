import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import React from 'react';

export const UncontrolledTextInputExample = () => {
  return (
    <React.Fragment>
      <input type="text" data-testid="uncontrolled-text-input" />
    </React.Fragment>
  );
};

export const uncontrolledTextInputExampleScenePart = {
  input: {
    locator: byDataTestId('uncontrolled-text-input'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export const uncontrolledTextInputExample: IExampleUnit<typeof uncontrolledTextInputExampleScenePart, JSX.Element> = {
  title: 'Uncontrolled text input',
  scene: uncontrolledTextInputExampleScenePart,
  ui: <UncontrolledTextInputExample />,
};

export const uncontrolledTextInputExampleTestSuite: TestSuiteInfo<typeof uncontrolledTextInputExample.scene> = {
  title: 'ControlledTextInput',
  url: '/input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${uncontrolledTextInputExample.title}`, () => {
      let testEngine: TestEngine<typeof uncontrolledTextInputExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(uncontrolledTextInputExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`set text value`, async () => {
        const targetValue = 'abc';
        await testEngine.parts.input.setValue(targetValue);
        const val = await testEngine.parts.input.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
