import { TimePickerDriver } from '@atomic-testing/component-driver-mui-x-v9';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicTimePickerUIExample } from './TimePicker.examples';

export const timePickerExampleScenePart = {
  picker: {
    locator: byDataTestId('basic-time-picker'),
    driver: TimePickerDriver,
  },
  secondPicker: {
    locator: byDataTestId('second-time-picker'),
    driver: TimePickerDriver,
  },
} satisfies ScenePart;

export const timePickerExample: IExampleUnit<typeof timePickerExampleScenePart, JSX.Element> = {
  ...basicTimePickerUIExample,
  scene: timePickerExampleScenePart,
};

export const timePickerTestSuite: TestSuiteInfo<typeof timePickerExampleScenePart> = {
  title: 'TimePicker',
  url: '/timepicker',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    const engine = useTestEngine(timePickerExample.scene, getTestEngine, { beforeEach, afterEach });

    test('getValueText returns the raw locale-formatted string', async () => {
      assertEqual(await engine().parts.picker.getValueText(), '02:30 PM');
    });

    test('getValue reads the time-of-day from the hidden input', async () => {
      const value = await engine().parts.picker.getValue();
      assertEqual(value?.getHours(), 14);
      assertEqual(value?.getMinutes(), 30);
    });

    test('two pickers are disambiguated - each reads its own value', async () => {
      const first = await engine().parts.picker.getValue();
      const second = await engine().parts.secondPicker.getValue();
      assertEqual(first?.getHours(), 14);
      assertEqual(second?.getHours(), 9);
      assertEqual(second?.getMinutes(), 5);
    });

    test('setValue types a PM time over the previous value', async () => {
      await engine().parts.picker.setValue(new Date(1970, 0, 1, 16, 45));
      assertEqual(await engine().parts.picker.getValueText(), '04:45 PM');
    });

    test('setValue types an AM time, flipping the meridiem section', async () => {
      await engine().parts.picker.setValue(new Date(1970, 0, 1, 7, 5));
      assertEqual(await engine().parts.picker.getValueText(), '07:05 AM');
    });

    test('setValue(null) clears the field', async () => {
      await engine().parts.picker.setValue(null);
      assertEqual(await engine().parts.picker.getValueText(), undefined);
      assertEqual(await engine().parts.picker.getValue(), null);
      // The other picker is untouched.
      assertEqual(await engine().parts.secondPicker.getValueText(), '09:05 AM');
    });

    test('setValue after clearing re-enters a value', async () => {
      await engine().parts.picker.setValue(null);
      await engine().parts.picker.setValue(new Date(1970, 0, 1, 12, 0));
      assertEqual(await engine().parts.picker.getValueText(), '12:00 PM');
    });
  },
};
