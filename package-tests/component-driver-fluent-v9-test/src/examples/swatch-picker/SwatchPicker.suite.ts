import { SwatchPickerDriver, SwatchPickerItemDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { swatchPickerUIExample } from './SwatchPicker.examples';

export const swatchPickerExampleScenePart = {
  pickerOne: { locator: byDataTestId('swatch-picker-one'), driver: SwatchPickerDriver },
  pickerTwo: { locator: byDataTestId('swatch-picker-two'), driver: SwatchPickerDriver },
  swatchOneRed: { locator: byDataTestId('swatch-one-red'), driver: SwatchPickerItemDriver },
  swatchOneBlue: { locator: byDataTestId('swatch-one-blue'), driver: SwatchPickerItemDriver },
  swatchOneDisabled: { locator: byDataTestId('swatch-one-disabled'), driver: SwatchPickerItemDriver },
  swatchTwoRed: { locator: byDataTestId('swatch-two-red'), driver: SwatchPickerItemDriver },
} satisfies ScenePart;

export const swatchPickerExample: IExampleUnit<typeof swatchPickerExampleScenePart, JSX.Element> = {
  ...swatchPickerUIExample,
  scene: swatchPickerExampleScenePart,
};

export const swatchPickerExampleTestSuite: TestSuiteInfo<typeof swatchPickerExample.scene> = {
  title: 'Fluent SwatchPicker',
  url: '/swatch-picker',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${swatchPickerExample.title}`, () => {
      const engine = useTestEngine(swatchPickerExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads the swatch count and rendered colors per instance', async () => {
        assertEqual(await engine().parts.pickerOne.getSwatchCount(), 5);
        assertEqual(await engine().parts.pickerOne.getSwatchColors(), [
          '#D13438',
          '#107C10',
          '#0078D4',
          '#FFB900',
          '#8A8886',
        ]);
        assertEqual(await engine().parts.pickerTwo.getSwatchCount(), 2);
      });

      test('reads the default selection and reselects by color', async () => {
        assertTrue(await engine().parts.swatchOneRed.isSelected());
        assertEqual(await engine().parts.pickerOne.getSelectedColor(), '#D13438');

        await engine().parts.pickerOne.selectByColor('#0078D4');

        assertEqual(await engine().parts.pickerOne.getSelectedColor(), '#0078D4');
        assertFalse(await engine().parts.swatchOneRed.isSelected());
        assertTrue(await engine().parts.swatchOneBlue.isSelected());
      });

      test('selects by index', async () => {
        await engine().parts.pickerOne.selectByIndex(3);

        assertEqual(await engine().parts.pickerOne.getSelectedColor(), '#FFB900');
        assertFalse(await engine().parts.swatchOneRed.isSelected());
      });

      test('two instances resolve their own selection independently', async () => {
        assertEqual(await engine().parts.pickerTwo.getSelectedColor(), undefined);
        assertFalse(await engine().parts.swatchTwoRed.isSelected());

        await engine().parts.pickerTwo.selectByColor('#D13438');

        assertTrue(await engine().parts.swatchTwoRed.isSelected());
        // pickerOne's own (unrelated) default selection is untouched by pickerTwo's click.
        assertEqual(await engine().parts.pickerOne.getSelectedColor(), '#D13438');
      });

      test('a disabled swatch cannot be selected', async () => {
        assertTrue(await engine().parts.swatchOneDisabled.isDisabled());
        assertFalse(await engine().parts.swatchOneDisabled.isSelected());

        await engine().parts.swatchOneDisabled.setSelected(true);

        assertFalse(await engine().parts.swatchOneDisabled.isSelected());
        assertTrue(await engine().parts.swatchOneRed.isSelected());
      });

      test('a swatch cannot be deselected directly', async () => {
        let threw = false;
        try {
          await engine().parts.swatchOneRed.setSelected(false);
        } catch {
          threw = true;
        }
        assertTrue(threw);
      });

      test('selectByIndex/selectByColor throw when no swatch matches', async () => {
        assertEqual(await engine().parts.pickerOne.getSwatchByIndex(99), null);

        let threwOnIndex = false;
        try {
          await engine().parts.pickerOne.selectByIndex(99);
        } catch {
          threwOnIndex = true;
        }
        assertTrue(threwOnIndex);

        let threwOnColor = false;
        try {
          await engine().parts.pickerOne.selectByColor('#000000');
        } catch {
          threwOnColor = true;
        }
        assertTrue(threwOnColor);
      });
    });
  },
};
