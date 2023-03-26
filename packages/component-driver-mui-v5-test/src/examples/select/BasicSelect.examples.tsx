import { SelectDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useCallback } from 'react';

//#region Basic select
export const basicSelectExampleData = {
  options: [
    { value: '20', label: 'Twenty' },
    { value: '30', label: 'Thirty' },
    { value: '60', label: 'Sixty' },
  ],
};

export const BasicSelectExample = () => {
  const [value, setValue] = React.useState('');
  const onChange = useCallback((event: SelectChangeEvent<string>) => {
    setValue(event.target.value);
  }, []);
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="simple-select-label">Age</InputLabel>
        <Select data-testid="simple-select" label="Age" labelId="simple-select-label" value={value} onChange={onChange}>
          {basicSelectExampleData.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export const basicSelectExampleScenePart = {
  select: {
    locator: byDataTestId('simple-select'),
    driver: SelectDriver,
  },
} satisfies ScenePart;

/**
 * Basic select example from MUI's website
 * @see https://mui.com/material-ui/react-select/#basic-select
 */
export const basicSelectExample: IExampleUnit<typeof basicSelectExampleScenePart, JSX.Element> = {
  title: 'Basic Select',
  scene: basicSelectExampleScenePart,
  ui: <BasicSelectExample />,
};
//#endregion

export const basicSelectTestSuite: TestSuiteInfo<typeof basicSelectExample.scene> = {
  title: 'Basic non-native select',
  url: '/select',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${basicSelectExample.title}`, () => {
      let testEngine: TestEngine<typeof basicSelectExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(basicSelectExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`setValue of rich select`, async () => {
        const targetValue = '30';
        await testEngine.parts.select.setValue(targetValue);
        const val = await testEngine.parts.select.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
