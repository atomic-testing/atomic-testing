import { SliderDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { sliderUIExample } from './Slider.examples';

export const sliderExampleScenePart = {
  slider: {
    locator: byDataTestId('slider'),
    driver: SliderDriver,
  },
  disabledSlider: {
    locator: byDataTestId('slider-disabled'),
    driver: SliderDriver,
  },
} satisfies ScenePart;

export const sliderExample: IExampleUnit<typeof sliderExampleScenePart, JSX.Element> = {
  ...sliderUIExample,
  scene: sliderExampleScenePart,
};

export const sliderExampleTestSuite: TestSuiteInfo<typeof sliderExample.scene> = {
  title: 'Radix Slider',
  url: '/slider',
  tests: (
    getTestEngine,
    { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse, assertApproxEqual, hasLayout }
  ) => {
    describe(`${sliderExample.title}`, () => {
      const engine = useTestEngine(sliderExample.scene, getTestEngine, { beforeEach, afterEach });

      // aria-valuenow/min/max are plain DOM state driven by React, not geometry,
      // so these reads are cross-engine (jsdom + E2E alike).
      test(`reads the initial value and bounds`, async () => {
        assertEqual(await engine().parts.slider.getValue(), 30);
        assertEqual(await engine().parts.slider.getMin(), 0);
        assertEqual(await engine().parts.slider.getMax(), 100);
      });

      test(`reads the accessible label`, async () => {
        assertEqual(await engine().parts.slider.getLabel(), 'Volume');
      });

      // Keyboard is the epic's required cross-engine write path (no native
      // <input type="range"> exists to drive with setRangeValue).
      test(`setValue steps the thumb up and down via the keyboard`, async () => {
        assertTrue(await engine().parts.slider.setValue(45));
        assertEqual(await engine().parts.slider.getValue(), 45);

        assertTrue(await engine().parts.slider.setValue(20));
        assertEqual(await engine().parts.slider.getValue(), 20);
      });

      test(`setValue clamps at the bounds`, async () => {
        assertTrue(await engine().parts.slider.setValue(100));
        assertEqual(await engine().parts.slider.getValue(), 100);

        assertTrue(await engine().parts.slider.setValue(0));
        assertEqual(await engine().parts.slider.getValue(), 0);
      });

      // An off-step target can never be landed on exactly — setValue reports that
      // honestly via its boolean return instead of pretending success.
      test(`setValue reports false for an off-step target`, async () => {
        assertFalse(await engine().parts.slider.setValue(47));
      });

      test(`isDisabled distinguishes the two scene instances`, async () => {
        assertFalse(await engine().parts.slider.isDisabled());
        assertTrue(await engine().parts.disabledSlider.isDisabled());
      });

      // Cross-engine: drag fires the pointer sequence without throwing even though
      // jsdom has no layout engine to move the thumb.
      test(`dragBy resolves without throwing`, async () => {
        await engine().parts.slider.dragBy({ x: 20, y: 0 });
        assertEqual(await engine().parts.slider.exists(), true);
      });

      // E2E-only: jsdom has no layout, so a drag never produces a positional
      // outcome there (Wave 0 audit verified +60px moves a 200px/step-5 track's
      // thumb 30 -> 65 in a real browser).
      if (hasLayout) {
        test(`dragBy moves the thumb by roughly the expected steps`, async () => {
          await engine().parts.slider.dragBy({ x: 60, y: 0 });
          const value = await engine().parts.slider.getValue();
          assertApproxEqual(value, 65, 5);
        });
      }
    });
  },
};
