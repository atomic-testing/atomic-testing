import { JSX } from 'react';

import { SliderDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicSliderExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicSliderExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('it should have a basic slider', async () => {
      assertEqual(await testEngine.parts.basic.exists(), true);
    });

    test('it should have a disabled slider', async () => {
      assertEqual(await testEngine.parts.disabled.exists(), true);
      assertEqual(await testEngine.parts.disabled.isDisabled(), true);
    });

    test('it should have a range slider', async () => {
      assertEqual(await testEngine.parts.range.exists(), true);
    });

    test.skip('it should be able to set value on basic slider', async () => {
      await testEngine.parts.basic.setValue(50);
      const value = await testEngine.parts.basic.getValue();
      assertEqual(value, 50);
    });
  },
};
