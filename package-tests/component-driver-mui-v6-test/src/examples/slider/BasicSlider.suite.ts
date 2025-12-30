import { JSX } from 'react';

import { SliderDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart} from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicSliderUIExample } from './BasicSlider.examples';

export const basicSliderExampleScenePart = {
  basic: {
    locator: byDataTestId('basic'),
    driver: SliderDriver,
  },
  disabled: {
    locator: byDataTestId('disabled'),
    driver: SliderDriver,
  },
  range: {
    locator: byDataTestId('range'),
    driver: SliderDriver,
  },
} satisfies ScenePart;

/**
 * Basic Slider example from MUI's website
 * @see https://mui.com/material-ui/react-slider
 */
export const basicSliderExample: IExampleUnit<typeof basicSliderExampleScenePart, JSX.Element> = {
  ...basicSliderUIExample,
  scene: basicSliderExampleScenePart,
};

export const basicSliderTestSuite: TestSuiteInfo<typeof basicSliderExampleScenePart> = {
  title: 'Basic Slider',
  url: '/slider',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    const engine = useTestEngine(basicSliderExample.scene, getTestEngine, { beforeEach, afterEach });

    test('it should have a basic slider', async () => {
      assertTrue(await engine().parts.basic.exists());
    });

    test('it should have a disabled slider', async () => {
      assertTrue(await engine().parts.disabled.exists());
      assertTrue(await engine().parts.disabled.isDisabled());
    });

    test('it should have a range slider', async () => {
      assertTrue(await engine().parts.range.exists());
    });

    test.skip('it should be able to set value on basic slider', async () => {
      await engine().parts.basic.setValue(50);
      const value = await engine().parts.basic.getValue();
      assertEqual(value, 50);
    });
  },
};
