import { JSX } from 'react';

import { DateRangeInput, DateRangePickerDriver } from '@atomic-testing/component-driver-mui-x-v5';
import { IExampleUnit, ScenePart,  byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicDateRangePickerUIExample } from './DateRangePicker.examples';

export const basicDateRangePickerExampleScenePart = {
  dateRange: {
    locator: byDataTestId('date-range-picker'),
    driver: DateRangePickerDriver,
  },
} satisfies ScenePart;

/**
 * Date Range Picker example from MUI's website
 * @see https://mui.com/material-ui/react-date-pickers/date-range-picker/
 */
export const basicDateRangePickerExample: IExampleUnit<typeof basicDateRangePickerExampleScenePart, JSX.Element> = {
  ...basicDateRangePickerUIExample,
  scene: basicDateRangePickerExampleScenePart,
};

export const basicDateRangePickerTestSuite: TestSuiteInfo<typeof basicDateRangePickerExampleScenePart> = {
  title: 'Date Range Picker',
  url: '/datepicker',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    const engine = useTestEngine(basicDateRangePickerExample.scene, getTestEngine, { beforeEach, afterEach });

    test('Driver should set date range correctly', async () => {
      const end = new Date('2018/09/21');
      const start = new Date('2016/03/02');
      const input: DateRangeInput = { start, end, type: 'date' };
      await engine().parts.dateRange.setValue(input);
      const retrieved = await engine().parts.dateRange.getValue();
      assertEqual(retrieved, input);
    });
  },
};
