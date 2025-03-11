import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

//#region Select TextField
export const selectTextFieldExampleData = {
  options: [
    { value: '20', label: 'Twenty' },
    { value: '30', label: 'Thirty' },
    { value: '60', label: 'Sixty' },
  ],
};

export const SelectTextField = () => {
  return (
    <Box>
      <TextField data-testid='select' select label='Number' defaultValue='30' helperText='Please select your number'>
        {selectTextFieldExampleData.options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export const selectTextFieldExampleScenePart = {
  select: {
    locator: byDataTestId('select'),
    driver: TextFieldDriver,
  },
} satisfies ScenePart;

export const selectTextFieldExample: IExampleUnit<typeof selectTextFieldExampleScenePart, JSX.Element> = {
  title: 'Select TextField',
  scene: selectTextFieldExampleScenePart,
  ui: <SelectTextField />,
};
//#endregion

export const selectTextFieldTestSuite: TestSuiteInfo<typeof selectTextFieldExample.scene> = {
  title: 'Select TextField',
  url: '/textfield',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${selectTextFieldExample.title}`, () => {
      let testEngine: TestEngine<typeof selectTextFieldExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(selectTextFieldExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`Label should be Number`, async () => {
        const label = await testEngine.parts.select.getLabel();
        assertEqual(label, 'Number');
      });

      test(`Value should be "30" as assigned`, async () => {
        const value = await testEngine.parts.select.getValue();
        assertEqual(value, '30');
      });

      test(`Alter value should change the value`, async () => {
        await testEngine.parts.select.setValue('60');
        const value = await testEngine.parts.select.getValue();
        assertEqual(value, '60');
      });
    });
  },
};
