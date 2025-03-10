import { InputDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Box from '@mui/material/Box';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import React from 'react';

//#region Example
export const BasicInput: React.FunctionComponent = () => {
  return (
    <Box component="form" noValidate autoComplete="off" gap="2rem" display="flex" alignItems="flex-start">
      <FilledInput data-testid="basic" />
      <FilledInput data-testid="readonly" readOnly />
      <FilledInput data-testid="disabled" disabled />
      <OutlinedInput data-testid="multiline" multiline rows={5} />
    </Box>
  );
};

export const basicInputExampleScenePart = {
  basic: {
    locator: byDataTestId('basic'),
    driver: InputDriver,
  },
  multiline: {
    locator: byDataTestId('multiline'),
    driver: InputDriver,
  },
  readonly: {
    locator: byDataTestId('readonly'),
    driver: InputDriver,
  },
  disabled: {
    locator: byDataTestId('disabled'),
    driver: InputDriver,
  },
} satisfies ScenePart;

export const basicInputExample: IExampleUnit<typeof basicInputExampleScenePart, JSX.Element> = {
  title: 'Basic Input',
  scene: basicInputExampleScenePart,
  ui: <BasicInput />,
};
//#endregion

export const basicInputTestSuite: TestSuiteInfo<typeof basicInputExample.scene> = {
  title: 'Basic Input',
  url: '/input',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${basicInputExample.title}`, () => {
      let testEngine: TestEngine<typeof basicInputExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(basicInputExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`Basic input's Value should be empty`, async () => {
        const value = await testEngine.parts.basic.getValue();
        assertEqual(value, '');
      });

      test(`Alter value should change the value`, async () => {
        await testEngine.parts.basic.setValue('Hello World');
        const value = await testEngine.parts.basic.getValue();
        assertEqual(value, 'Hello World');
      });

      test(`Multiline input's Value should be empty`, async () => {
        const value = await testEngine.parts.multiline.getValue();
        assertEqual(value, '');
      });

      test(`Alter multiline value should change the value`, async () => {
        await testEngine.parts.multiline.setValue('Hello World');
        const value = await testEngine.parts.multiline.getValue();
        assertEqual(value, 'Hello World');
      });

      test(`Readonly part is readonly`, async () => {
        const value = await testEngine.parts.readonly.isReadonly();
        assertEqual(value, true);
      });

      test(`Disabled part is disabled`, async () => {
        const value = await testEngine.parts.disabled.isDisabled();
        assertEqual(value, true);
      });
    });
  },
};
