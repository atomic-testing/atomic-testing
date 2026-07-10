import { DateTimePickerDriver } from '@atomic-testing/component-driver-mui-x-v9';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicDateTimePickerUIExample } from './DateTimePicker.examples';

export const dateTimePickerExampleScenePart = {
  picker: {
    locator: byDataTestId('basic-datetime-picker'),
    driver: DateTimePickerDriver,
  },
  secondPicker: {
    locator: byDataTestId('second-datetime-picker'),
    driver: DateTimePickerDriver,
  },
} satisfies ScenePart;

export const dateTimePickerExample: IExampleUnit<typeof dateTimePickerExampleScenePart, JSX.Element> = {
  ...basicDateTimePickerUIExample,
  scene: dateTimePickerExampleScenePart,
};

export const dateTimePickerTestSuite: TestSuiteInfo<typeof dateTimePickerExampleScenePart> = {
  title: 'DateTimePicker',
  url: '/datetimepicker',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    const engine = useTestEngine(dateTimePickerExample.scene, getTestEngine, { beforeEach, afterEach });

    test('getValueText returns the raw locale-formatted string', async () => {
      assertEqual(await engine().parts.picker.getValueText(), '06/27/2026 02:30 PM');
    });

    test('getValue reads date and time from the hidden input', async () => {
      const value = await engine().parts.picker.getValue();
      assertEqual(value?.getFullYear(), 2026);
      assertEqual(value?.getMonth(), 5); // June (0-based)
      assertEqual(value?.getDate(), 27);
      assertEqual(value?.getHours(), 14);
      assertEqual(value?.getMinutes(), 30);
    });

    test('two pickers are disambiguated - each reads its own value', async () => {
      const first = await engine().parts.picker.getValue();
      const second = await engine().parts.secondPicker.getValue();
      assertEqual(first?.getFullYear(), 2026);
      assertEqual(second?.getFullYear(), 2020);
      assertEqual(second?.getHours(), 9);
      assertEqual(second?.getMinutes(), 5);
    });

    test('setValue types a full datetime over the previous value', async () => {
      await engine().parts.picker.setValue(new Date(2025, 11, 25, 21, 30));
      assertEqual(await engine().parts.picker.getValueText(), '12/25/2025 09:30 PM');
    });

    // Midnight exercises the 24h→12h edge: hour 0 types as 12 with the 'a' meridiem keystroke.
    test('setValue handles midnight (12 AM)', async () => {
      await engine().parts.picker.setValue(new Date(2026, 0, 5, 0, 15));
      assertEqual(await engine().parts.picker.getValueText(), '01/05/2026 12:15 AM');
    });

    test('setValue(null) clears the field', async () => {
      await engine().parts.picker.setValue(null);
      assertEqual(await engine().parts.picker.getValueText(), undefined);
      assertEqual(await engine().parts.picker.getValue(), null);
      // The other picker is untouched.
      assertEqual(await engine().parts.secondPicker.getValueText(), '01/15/2020 09:05 AM');
    });

    test('setValue after clearing re-enters a value', async () => {
      await engine().parts.picker.setValue(null);
      await engine().parts.picker.setValue(new Date(2026, 2, 3, 8, 45));
      assertEqual(await engine().parts.picker.getValueText(), '03/03/2026 08:45 AM');
    });
  },
};
