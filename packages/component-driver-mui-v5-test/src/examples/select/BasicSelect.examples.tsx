import React, { useCallback } from 'react';

import { SelectDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
        <InputLabel id='simple-select-label'>Age</InputLabel>
        <Select data-testid='simple-select' label='Age' labelId='simple-select-label' value={value} onChange={onChange}>
          {basicSelectExampleData.options.map(option => (
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

      test('item Thirty exists', async () => {
        const itemDriver = await testEngine.parts.select.getMenuItemByLabel('Thirty');
        let exists = true;
        if (itemDriver == null) {
          exists = false;
        } else {
          exists = await itemDriver.exists();
        }
        assertEqual(exists, true);
      });

      test('item Ten does not exists', async () => {
        const itemDriver = await testEngine.parts.select.getMenuItemByLabel('Ten');
        let exists = true;
        if (itemDriver == null) {
          exists = false;
        } else {
          exists = await itemDriver.exists();
        }
        assertEqual(exists, false);
      });

      test(`setValue of rich select`, async () => {
        const targetValue = '30';
        await testEngine.parts.select.setValue(targetValue);
        const val = await testEngine.parts.select.getValue();
        assertEqual(val, targetValue);
      });

      test(`get label of rich select`, async () => {
        const targetValue = '30';
        await testEngine.parts.select.setValue(targetValue);
        const val = await testEngine.parts.select.getSelectedLabel();
        assertEqual(val, 'Thirty');
      });

      test(`set label of rich select`, async () => {
        await testEngine.parts.select.selectByLabel('Thirty');
        const val = await testEngine.parts.select.getValue();
        assertEqual(val, '30');
      });
    });
  },
};
