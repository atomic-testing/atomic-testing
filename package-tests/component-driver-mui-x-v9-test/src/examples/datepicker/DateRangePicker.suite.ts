import { DateRangePickerDriver } from '@atomic-testing/component-driver-mui-x-v9';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicDateRangePickerUIExample } from './DateRangePicker.examples';

export const dateRangePickerExampleScenePart = {
  picker: {
    locator: byDataTestId('basic-date-range-picker'),
    driver: DateRangePickerDriver,
  },
} satisfies ScenePart;

export const dateRangePickerExample: IExampleUnit<typeof dateRangePickerExampleScenePart, JSX.Element> = {
  ...basicDateRangePickerUIExample,
  scene: dateRangePickerExampleScenePart,
};

export const dateRangePickerTestSuite: TestSuiteInfo<typeof dateRangePickerExampleScenePart> = {
  title: 'DateRangePicker',
  url: '/daterangepicker',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    const engine = useTestEngine(dateRangePickerExample.scene, getTestEngine, { beforeEach, afterEach });

    test('getValueText returns both dates joined by the range separator', async () => {
      assertEqual(await engine().parts.picker.getValueText(), '06/27/2026 – 07/04/2026');
    });

    test('getValue reads both sides of the range from the hidden input', async () => {
      const value = await engine().parts.picker.getValue();
      assertEqual(value?.start?.getFullYear(), 2026);
      assertEqual(value?.start?.getMonth(), 5); // June (0-based)
      assertEqual(value?.start?.getDate(), 27);
      assertEqual(value?.end?.getMonth(), 6); // July
      assertEqual(value?.end?.getDate(), 4);
    });

    test('setValue types both dates, auto-advancing across the range separator', async () => {
      await engine().parts.picker.setValue({ start: new Date(2025, 11, 25), end: new Date(2026, 0, 15) });
      assertEqual(await engine().parts.picker.getValueText(), '12/25/2025 – 01/15/2026');
    });

    test('setValue(null) clears the whole field', async () => {
      await engine().parts.picker.setValue(null);
      assertEqual(await engine().parts.picker.getValueText(), undefined);
      assertEqual(await engine().parts.picker.getValue(), null);
    });

    test('setValue after clearing re-enters a range', async () => {
      await engine().parts.picker.setValue(null);
      await engine().parts.picker.setValue({ start: new Date(2026, 1, 1), end: new Date(2026, 1, 14) });
      assertEqual(await engine().parts.picker.getValueText(), '02/01/2026 – 02/14/2026');
    });

    test('setValue rejects a one-sided range', async () => {
      let threw = false;
      try {
        await engine().parts.picker.setValue({ start: new Date(2026, 1, 1), end: null });
      } catch {
        threw = true;
      }
      assertTrue(threw);
      // The field is untouched by the rejected write.
      assertEqual(await engine().parts.picker.getValueText(), '06/27/2026 – 07/04/2026');
    });
  },
};
