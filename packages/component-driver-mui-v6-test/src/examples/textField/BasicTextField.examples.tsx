import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React from 'react';

//#region Label text field
export const BasicTextField: React.FunctionComponent = () => {
  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField data-testid="basic" label="Basic Field" variant="outlined" helperText="Enter text here" />
    </Box>
  );
};

export const basicTextFieldExampleScenePart = {
  basic: {
    locator: byDataTestId('basic'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

/**
 * Basic TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/#basic-textfield
 */
export const basicTextFieldExample: IExampleUnit<typeof basicTextFieldExampleScenePart, JSX.Element> = {
  title: 'Basic TextField',
  scene: basicTextFieldExampleScenePart,
  ui: <BasicTextField />,
};
//#endregion

export const basicTextFieldTestSuite: TestSuiteInfo<typeof basicTextFieldExampleScenePart> = {
  title: 'Basic TextField',
  url: '/textfield',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${basicTextFieldExample.title}`, () => {
      let testEngine: TestEngine<typeof basicTextFieldExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(basicTextFieldExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`Label should be Basic Field`, async () => {
        const label = await testEngine.parts.basic.getLabel();
        assertEqual(label, 'Basic Field');
      });

      test(`Helper text should be Enter text here`, async () => {
        const helperText = await testEngine.parts.basic.getHelperText();
        assertEqual(helperText, 'Enter text here');
      });

      test(`Value should be empty`, async () => {
        const value = await testEngine.parts.basic.getValue();
        assertEqual(value, '');
      });

      test(`Alter value should change the value`, async () => {
        await testEngine.parts.basic.setValue('Hello World');
        const value = await testEngine.parts.basic.getValue();
        assertEqual(value, 'Hello World');
      });
    });
  },
};
