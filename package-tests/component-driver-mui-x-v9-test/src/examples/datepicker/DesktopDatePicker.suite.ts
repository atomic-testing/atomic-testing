import { DesktopDatePickerDriver } from '@atomic-testing/component-driver-mui-x-v9';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicDesktopDatePickerUIExample } from './DesktopDatePicker.examples';

export const desktopDatePickerExampleScenePart = {
  picker: {
    locator: byDataTestId('basic-desktop-date-picker'),
    driver: DesktopDatePickerDriver,
  },
  secondPicker: {
    locator: byDataTestId('second-desktop-date-picker'),
    driver: DesktopDatePickerDriver,
  },
} satisfies ScenePart;

export const desktopDatePickerExample: IExampleUnit<typeof desktopDatePickerExampleScenePart, JSX.Element> = {
  ...basicDesktopDatePickerUIExample,
  scene: desktopDatePickerExampleScenePart,
};

export const desktopDatePickerTestSuite: TestSuiteInfo<typeof desktopDatePickerExampleScenePart> = {
  title: 'DesktopDatePicker',
  url: '/datepicker',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    const engine = useTestEngine(desktopDatePickerExample.scene, getTestEngine, { beforeEach, afterEach });

    test('getValue reads the default value from the hidden input', async () => {
      const value = await engine().parts.picker.getValue();
      assertEqual(value?.getFullYear(), 2026);
      assertEqual(value?.getMonth(), 5); // June (0-based)
      assertEqual(value?.getDate(), 27);
    });

    test('getValueText returns the raw locale-formatted string', async () => {
      const text = await engine().parts.picker.getValueText();
      assertEqual(text, '06/27/2026');
    });

    test('two pickers are disambiguated - each reads its own value', async () => {
      const first = await engine().parts.picker.getValue();
      const second = await engine().parts.secondPicker.getValue();
      assertEqual(first?.getFullYear(), 2026);
      assertEqual(second?.getFullYear(), 2020);
      assertEqual(second?.getMonth(), 0); // January
      assertEqual(second?.getDate(), 15);
    });

    test('setValue selects a day in the currently shown month', async () => {
      // Default value is June 2026, so the popup opens on the target month directly.
      await engine().parts.picker.setValue(new Date(2026, 5, 30));
      assertEqual(await engine().parts.picker.getValueText(), '06/30/2026');
    });

    test('pickDate pages forward across months', async () => {
      await engine().parts.picker.pickDate('2026-09-14');
      assertEqual(await engine().parts.picker.getValueText(), '09/14/2026');
    });

    test('pickDate pages backward across months', async () => {
      await engine().parts.picker.pickDate('2026-02-03');
      assertEqual(await engine().parts.picker.getValueText(), '02/03/2026');
    });

    test('pickDate operates each picker independently', async () => {
      await engine().parts.secondPicker.pickDate('2020-01-20');
      assertEqual(await engine().parts.secondPicker.getValueText(), '01/20/2020');
      // The first picker is untouched.
      assertEqual(await engine().parts.picker.getValueText(), '06/27/2026');
    });
  },
};
