import {
  DateTimePickerDriver,
  DesktopDatePickerDriver,
  MobileDatePickerDriver,
  TimePickerDriver,
} from '@atomic-testing/component-driver-mui-v5';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';

export const BasicDatePicker: React.FunctionComponent = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2018-08-18T21:11:54'));

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <div data-testid="desktop-date-picker">
          <DesktopDatePicker
            label="Date desktop"
            inputFormat="MM/DD/YYYY"
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <div data-testid="mobile-date-picker">
          <MobileDatePicker
            label="Date mobile"
            inputFormat="MM/DD/YYYY"
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <div data-testid="time-picker">
          <TimePicker
            label="Time"
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <div data-testid="date-time-picker">
          <DateTimePicker
            label="Date&Time picker"
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
      </Stack>
    </LocalizationProvider>
  );
};

export const basicDatePickerExampleScenePart = {
  desktopPicker: {
    locator: byDataTestId('desktop-date-picker'),
    driver: DesktopDatePickerDriver,
  },
  mobilePicker: {
    locator: byDataTestId('mobile-date-picker'),
    driver: MobileDatePickerDriver,
  },
  timePicker: {
    locator: byDataTestId('time-picker'),
    driver: TimePickerDriver,
  },
  dateTimePicker: {
    locator: byDataTestId('date-time-picker'),
    driver: DateTimePickerDriver,
  },
} satisfies ScenePart;

/**
 * Basic DataGridPro example from MUI's website
 * @see https://mui.com/material-ui/react-datagridpro#description
 */
export const basicDatePickerExample: IExampleUnit<typeof basicDatePickerExampleScenePart, JSX.Element> = {
  title: 'Basic DatePicker',
  scene: basicDatePickerExampleScenePart,
  ui: <BasicDatePicker />,
};
//#endregion

export const basicDatePickerTestSuite: TestSuiteInfo<typeof basicDatePickerExampleScenePart> = {
  title: 'Basic DatePicker',
  url: '/datepicker',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicDatePickerExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicDatePickerExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    describe('DesktopDatePickerDriver', () => {
      test('Driver should set date correctly', async () => {
        const date = new Date('2016/03/02');
        await testEngine.parts.desktopPicker.setValue(date);
        const retrieved = await testEngine.parts.desktopPicker.getValue();
        assertEqual(retrieved?.toDateString(), date.toDateString());
      });
    });

    describe('MobileDatePickerDriver', () => {
      test('Driver should set date correctly', async () => {
        const date = new Date('2018/09/21');
        await testEngine.parts.mobilePicker.setValue(date);
        const retrieved = await testEngine.parts.mobilePicker.getValue();
        assertEqual(retrieved?.toDateString(), date.toDateString());
      });
    });

    describe('TimePickerDriver', () => {
      test('Driver should set time correctly', async () => {
        const date = new Date('2018/09/21 00:18');
        await testEngine.parts.timePicker.setValue(date);
        const retrieved = await testEngine.parts.timePicker.getValue();
        assertEqual(retrieved?.toTimeString(), date.toTimeString());
      });
    });

    describe('DateTimePickerDriver', () => {
      test('Driver should set date/time correctly', async () => {
        const date = new Date('2018/09/21 00:18');
        await testEngine.parts.timePicker.setValue(date);
        const retrieved = await testEngine.parts.timePicker.getValue();
        assertEqual(retrieved?.toTimeString(), date.toTimeString());
      });
    });
  },
};
