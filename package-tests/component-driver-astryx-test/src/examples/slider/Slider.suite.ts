import { SliderDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { sliderUIExample } from './Slider.examples';

export const sliderExampleScenePart = {
  volume: {
    locator: byDataTestId('volume-slider'),
    driver: SliderDriver,
  },
} satisfies ScenePart;

export const sliderExample: IExampleUnit<typeof sliderExampleScenePart, JSX.Element> = {
  ...sliderUIExample,
  scene: sliderExampleScenePart,
};

export const sliderExampleTestSuite: TestSuiteInfo<typeof sliderExample.scene> = {
  title: 'Astryx Slider',
  url: '/slider',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${sliderExample.title}`, () => {
      const engine = useTestEngine(sliderExample.scene, getTestEngine, { beforeEach, afterEach });

      // getValue/getMin/getMax read the thumb's aria-value* attributes.
      test(`getValue/getMin/getMax read the slider bounds and value`, async () => {
        assertEqual(await engine().parts.volume.getValue(), 50);
        assertEqual(await engine().parts.volume.getMin(), 0);
        assertEqual(await engine().parts.volume.getMax(), 100);
      });

      // getLabel reads the thumb's aria-label; the slider is enabled.
      test(`getLabel and isDisabled read the slider state`, async () => {
        assertEqual(await engine().parts.volume.getLabel(), 'Volume');
        assertFalse(await engine().parts.volume.isDisabled());
      });

      // setValue drives the value by keyboard (Arrow stepping).
      test(`setValue moves the value via the keyboard`, async () => {
        assertTrue(await engine().parts.volume.setValue(70));
        assertEqual(await engine().parts.volume.getValue(), 70);
      });
    });
  },
};
