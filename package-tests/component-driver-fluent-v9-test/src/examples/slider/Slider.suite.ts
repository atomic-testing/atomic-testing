import { SliderDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { sliderUIExample } from './Slider.examples';

export const sliderExampleScenePart = {
  a: { locator: byDataTestId('slider-a'), driver: SliderDriver },
  b: { locator: byDataTestId('slider-b'), driver: SliderDriver },
  disabled: { locator: byDataTestId('slider-disabled'), driver: SliderDriver },
  required: { locator: byDataTestId('slider-required'), driver: SliderDriver },
} satisfies ScenePart;

export const sliderExample: IExampleUnit<typeof sliderExampleScenePart, JSX.Element> = {
  ...sliderUIExample,
  scene: sliderExampleScenePart,
};

export const sliderExampleTestSuite: TestSuiteInfo<typeof sliderExample.scene> = {
  title: 'Fluent Slider',
  url: '/slider',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${sliderExample.title}`, () => {
      const engine = useTestEngine(sliderExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads and writes the value', async () => {
        assertEqual(await engine().parts.a.getValue(), 20);

        const reachedTarget = await engine().parts.a.setValue(35);
        assertTrue(reachedTarget);
        assertEqual(await engine().parts.a.getValue(), 35);
      });

      test('reads independent min/max/step bounds per instance', async () => {
        assertEqual(await engine().parts.a.getMin(), 0);
        assertEqual(await engine().parts.a.getMax(), 50);
        assertEqual(await engine().parts.a.getStep(), 5);

        assertEqual(await engine().parts.b.getMin(), 10);
        assertEqual(await engine().parts.b.getMax(), 100);
        assertEqual(await engine().parts.b.getStep(), 10);
      });

      test('reads independent values per instance (disambiguation)', async () => {
        assertEqual(await engine().parts.a.getValue(), 20);
        assertEqual(await engine().parts.b.getValue(), 70);

        await engine().parts.a.setValue(40);
        assertEqual(await engine().parts.a.getValue(), 40);
        assertEqual(await engine().parts.b.getValue(), 70);
      });

      test('reads the accessible label (undefined when unset)', async () => {
        assertEqual(await engine().parts.a.getLabel(), 'Volume A');
        assertEqual(await engine().parts.b.getLabel(), undefined);
      });

      test('reads disabled/required state per instance', async () => {
        assertFalse(await engine().parts.a.isDisabled());
        assertTrue(await engine().parts.disabled.isDisabled());

        assertFalse(await engine().parts.a.isRequired());
        assertTrue(await engine().parts.required.isRequired());
      });
    });
  },
};
