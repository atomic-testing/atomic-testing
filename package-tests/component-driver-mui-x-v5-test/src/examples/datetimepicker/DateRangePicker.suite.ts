import { JSX } from 'react';

import { DateRangeInput, DateRangePickerDriver } from '@atomic-testing/component-driver-mui-x-v5';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
