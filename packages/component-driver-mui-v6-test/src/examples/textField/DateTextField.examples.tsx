import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import React from 'react';

//#region Label text field
export const DateTextField: React.FunctionComponent = () => {
  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField data-testid="date" label="Date Field" type="date" variant="outlined" helperText="Enter a date here" />
    </Box>
  );
};

export const dateTextFieldExampleScenePart = {
  date: {
    locator: byDataTestId('date'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

/**
 * Date TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/#date-textfield
 */
export const dateTextFieldExample: IExampleUnit<typeof dateTextFieldExampleScenePart, JSX.Element> = {
  title: 'Date TextField',
  scene: dateTextFieldExampleScenePart,
  ui: <DateTextField />,
};
//#endregion

export const dateTextFieldTestSuite: TestSuiteInfo<typeof dateTextFieldExampleScenePart> = {
  title: 'Date TextField',
  url: '/textfield',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${dateTextFieldExample.title}`, () => {
      let testEngine: TestEngine<typeof dateTextFieldExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(dateTextFieldExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`Label should be Date Field`, async () => {
        const label = await testEngine.parts.date.getLabel();
        assertEqual(label, 'Date Field');
      });

      test(`Helper text should be Enter a date here`, async () => {
        const helperText = await testEngine.parts.date.getHelperText();
        assertEqual(helperText, 'Enter a date here');
      });

      test(`Value should be empty`, async () => {
        const value = await testEngine.parts.date.getValue();
        assertEqual(value, '');
      });

      test(`Alter value should change the value`, async () => {
        await testEngine.parts.date.setValue('2015-12-22');
        const value = await testEngine.parts.date.getValue();
        assertEqual(value, '2015-12-22');
      });
    });
  },
};
