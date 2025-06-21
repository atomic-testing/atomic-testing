import { JSX } from 'react';

import {
  DateTimePickerDriver,
  DesktopDatePickerDriver,
  MobileDatePickerDriver,
  TimePickerDriver,
} from '@atomic-testing/component-driver-mui-x-v5';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

import { basicDatePickerUIExample } from './BasicDateTimePicker.examples';

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
 * Basic DatePicker example from MUI's website
 * @see https://mui.com/material-ui/react-date-pickers/getting-started/
 */
export const basicDatePickerExample: IExampleUnit<typeof basicDatePickerExampleScenePart, JSX.Element> = {
  ...basicDatePickerUIExample,
  scene: basicDatePickerExampleScenePart,
};

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
        assertEqual(retrieved?.toLocaleTimeString(), date.toLocaleTimeString());
      });
    });

    describe('DateTimePickerDriver', () => {
      test('Driver should set date/time correctly', async () => {
        const date = new Date('2018/09/21 00:18');
        await testEngine.parts.timePicker.setValue(date);
        const retrieved = await testEngine.parts.timePicker.getValue();
        assertEqual(retrieved?.toLocaleTimeString(), date.toLocaleTimeString());
      });
    });
  },
};
