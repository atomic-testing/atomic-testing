import { MobileDatePickerDriver } from '@atomic-testing/component-driver-mui-x-v9';
import { IExampleUnit, ScenePart, byDataTestId } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicMobileDatePickerUIExample } from './MobileDatePicker.examples';

export const mobileDatePickerExampleScenePart = {
  picker: {
    locator: byDataTestId('basic-mobile-date-picker'),
    driver: MobileDatePickerDriver,
  },
  secondPicker: {
    locator: byDataTestId('second-mobile-date-picker'),
    driver: MobileDatePickerDriver,
  },
} satisfies ScenePart;

export const mobileDatePickerExample: IExampleUnit<typeof mobileDatePickerExampleScenePart, JSX.Element> = {
  ...basicMobileDatePickerUIExample,
  scene: mobileDatePickerExampleScenePart,
};

export const mobileDatePickerTestSuite: TestSuiteInfo<typeof mobileDatePickerExampleScenePart> = {
  title: 'MobileDatePicker',
  url: '/mobiledatepicker',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    const engine = useTestEngine(mobileDatePickerExample.scene, getTestEngine, { beforeEach, afterEach });

    test('getValue reads the default value from the hidden input', async () => {
      const value = await engine().parts.picker.getValue();
      assertEqual(value?.getFullYear(), 2026);
      assertEqual(value?.getMonth(), 5); // June (0-based)
      assertEqual(value?.getDate(), 27);
    });

    test('getValueText returns the raw locale-formatted string', async () => {
      assertEqual(await engine().parts.picker.getValueText(), '06/27/2026');
    });

    test('two pickers are disambiguated - each reads its own value', async () => {
      const first = await engine().parts.picker.getValue();
      const second = await engine().parts.secondPicker.getValue();
      assertEqual(first?.getFullYear(), 2026);
      assertEqual(second?.getFullYear(), 2020);
    });

    test('setValue picks a day in the current month via the entry dialog', async () => {
      await engine().parts.picker.setValue(new Date(2026, 5, 15));
      assertEqual(await engine().parts.picker.getValueText(), '06/15/2026');
    });

    test('setValue pages the dialog calendar across months', async () => {
      await engine().parts.picker.setValue(new Date(2026, 8, 3));
      assertEqual(await engine().parts.picker.getValueText(), '09/03/2026');
    });

    test('cancel dismisses the dialog without committing the picked day', async () => {
      const dialog = await engine().parts.picker.openEntryDialog();
      await dialog.pickDay(new Date(2026, 5, 20));
      await dialog.cancel();
      assertEqual(await engine().parts.picker.getValueText(), '06/27/2026');
    });

    test('setValue operates each picker independently', async () => {
      await engine().parts.secondPicker.setValue(new Date(2020, 0, 20));
      assertEqual(await engine().parts.secondPicker.getValueText(), '01/20/2020');
      // The first picker is untouched.
      assertEqual(await engine().parts.picker.getValueText(), '06/27/2026');
    });
  },
};
