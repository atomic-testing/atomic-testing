import { DateRangeInput, DateRangePickerDriver } from '@atomic-testing/component-driver-mui-v5';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import { Box, TextField } from '@mui/material';
import { DateRange, DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';
import React from 'react';

export const BasicDateRangePicker: React.FunctionComponent = () => {
  const [value, setValue] = React.useState<DateRange<Dayjs>>([null, null]);

  return (
    <div data-testid="date-range-picker">
      <LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: 'Check-in', end: 'Check-out' }}>
        <DateRangePicker
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
            </React.Fragment>
          )}
        />
      </LocalizationProvider>
    </div>
  );
};

export const basicDateRangePickerExampleScenePart = {
  dateRange: {
    locator: byDataTestId('date-range-picker'),
    driver: DateRangePickerDriver,
  },
} satisfies ScenePart;

/**
 * Basic DataGridPro example from MUI's website
 * @see https://mui.com/material-ui/react-datagridpro#description
 */
export const basicDateRangePickerExample: IExampleUnit<typeof basicDateRangePickerExampleScenePart, JSX.Element> = {
  title: 'Date Range Picker',
  scene: basicDateRangePickerExampleScenePart,
  ui: <BasicDateRangePicker />,
};
//#endregion

export const basicDateRangePickerTestSuite: TestSuiteInfo<typeof basicDateRangePickerExampleScenePart> = {
  title: 'Date Range Picker',
  url: '/datepicker',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicDateRangePickerExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicDateRangePickerExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Driver should set date range correctly', async () => {
      const end = new Date('2018/09/21');
      const start = new Date('2016/03/02');
      const input: DateRangeInput = { start, end, type: 'date' };
      await testEngine.parts.dateRange.setValue(input);
      const retrieved = await testEngine.parts.dateRange.getValue();
      assertEqual(retrieved, input);
    });
  },
};
