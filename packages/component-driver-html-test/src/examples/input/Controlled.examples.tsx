import React from 'react';

import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

export const ControlledTextInputExample = () => {
  const [value, setValue] = React.useState('');
  const input_onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);
  return (
    <React.Fragment>
      <input type='text' data-testid='controlled-text-input' value={value} onChange={input_onChange} />
    </React.Fragment>
  );
};

export const controlledTextInputExampleScenePart = {
  input: {
    locator: byDataTestId('controlled-text-input'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export const controlledTextInputExample: IExampleUnit<typeof controlledTextInputExampleScenePart, JSX.Element> = {
  title: 'Control text input',
  scene: controlledTextInputExampleScenePart,
  ui: <ControlledTextInputExample />,
};

export const controlledTextInputExampleTestSuite: TestSuiteInfo<typeof controlledTextInputExample.scene> = {
  title: 'ControlledTextInput',
  url: '/input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${controlledTextInputExample.title}`, () => {
      let testEngine: TestEngine<typeof controlledTextInputExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(controlledTextInputExample.scene, { page });
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
