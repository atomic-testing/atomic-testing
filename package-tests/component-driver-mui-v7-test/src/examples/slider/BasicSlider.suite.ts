import { JSX } from 'react';

import { SliderDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
    let testEngine: TestEngine<typeof basicSliderExample.scene>;
    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(basicSliderExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('it should have a basic slider', async () => {
      assertTrue(await testEngine.parts.basic.exists());
    });

    test('it should have a disabled slider', async () => {
      assertTrue(await testEngine.parts.disabled.exists());
      assertTrue(await testEngine.parts.disabled.isDisabled());
    });

    test('it should have a range slider', async () => {
      assertTrue(await testEngine.parts.range.exists());
    });

    test.skip('it should be able to set value on basic slider', async () => {
      await testEngine.parts.basic.setValue(50);
      const value = await testEngine.parts.basic.getValue();
      assertEqual(value, 50);
    });
  },
};
