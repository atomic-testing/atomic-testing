import { ColorAreaDriver, ColorPickerDriver, ColorSliderDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { colorPickerUIExample } from './ColorPicker.examples';

export const colorPickerExampleScenePart = {
  pickerA: { locator: byDataTestId('picker-a'), driver: ColorPickerDriver },
  pickerB: { locator: byDataTestId('picker-b'), driver: ColorPickerDriver },
  hueDisabled: { locator: byDataTestId('hue-disabled'), driver: ColorSliderDriver },
  hueRequired: { locator: byDataTestId('hue-required'), driver: ColorSliderDriver },
  areaLabeled: { locator: byDataTestId('area-labeled'), driver: ColorAreaDriver },
} satisfies ScenePart;

export const colorPickerExample: IExampleUnit<typeof colorPickerExampleScenePart, JSX.Element> = {
  ...colorPickerUIExample,
  scene: colorPickerExampleScenePart,
};

export const colorPickerExampleTestSuite: TestSuiteInfo<typeof colorPickerExample.scene> = {
  title: 'Fluent Color Picker',
  url: '/color-picker',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${colorPickerExample.title}`, () => {
      const engine = useTestEngine(colorPickerExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads the initial color per instance (disambiguation)', async () => {
        assertEqual(await engine().parts.pickerA.getColor(), { hue: 0, saturation: 100, value: 100 });
        assertEqual(await engine().parts.pickerB.getColor(), { hue: 200, saturation: 40, value: 60 });
      });

      test('drives hue and saturation/value independently, leaving the other instance untouched', async () => {
        const hueOk = await engine().parts.pickerA.setHue(280);
        assertTrue(hueOk);
        const svOk = await engine().parts.pickerA.setSaturationValue(65, 35);
        assertTrue(svOk);
        assertEqual(await engine().parts.pickerA.getColor(), { hue: 280, saturation: 65, value: 35 });

        assertEqual(await engine().parts.pickerB.getColor(), { hue: 200, saturation: 40, value: 60 });
      });

      test('reads independent hue bounds via the composed hueSlider part', async () => {
        assertEqual(await engine().parts.pickerA.parts.hueSlider.getMin(), 0);
        assertEqual(await engine().parts.pickerA.parts.hueSlider.getMax(), 360);
      });

      test('reads disabled/required state per instance', async () => {
        assertFalse(await engine().parts.pickerA.parts.hueSlider.isDisabled());
        assertTrue(await engine().parts.hueDisabled.isDisabled());

        assertFalse(await engine().parts.pickerA.parts.hueSlider.isRequired());
        assertTrue(await engine().parts.hueRequired.isRequired());
      });

      test('reads the invalid/error state (false when unset)', async () => {
        assertFalse(await engine().parts.pickerA.parts.hueSlider.isError());
      });

      test('reads the accessible label on the hue slider (undefined when unset)', async () => {
        assertEqual(await engine().parts.pickerA.parts.hueSlider.getLabel(), undefined);
        assertEqual(await engine().parts.hueRequired.getLabel(), 'Hue');
      });

      test('reads the accessible label on the color area (undefined when unset)', async () => {
        assertEqual(await engine().parts.pickerA.parts.area.getLabel(), undefined);
        assertEqual(await engine().parts.areaLabeled.getLabel(), 'Saturation and brightness');
      });
    });
  },
};
