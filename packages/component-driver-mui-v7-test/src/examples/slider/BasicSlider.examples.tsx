import React from 'react';

import { SliderDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';

//#region Example
export const BasicSlider: React.FunctionComponent = () => {
  const [rangeValues, setRangeValues] = React.useState([30, 65]);

  const handleRangeChange = (event: Event, newValue: number | number[]) => {
    setRangeValues(newValue as number[]);
  };

  return (
    <Stack direction='column'>
      <Slider data-testid='basic' defaultValue={75} />
      <Slider data-testid='disabled' disabled value={75} />
      <Slider data-testid='range' value={rangeValues} onChange={handleRangeChange} />
    </Stack>
  );
};

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
  title: 'Basic Slider',
  scene: basicSliderExampleScenePart,
  ui: <BasicSlider />,
};
//#endregion

export const basicSliderTestSuite: TestSuiteInfo<typeof basicSliderExampleScenePart> = {
  title: 'Basic Slider',
  url: '/slider',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${basicSliderExample.title}`, () => {
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

      test(`Basic slider's Value should be 75`, async () => {
        const value = await testEngine.parts.basic.getValue();
        assertEqual(value, 75);
      });

      test(`Disabled slider's value should be 75`, async () => {
        const value = await testEngine.parts.disabled.getValue();
        assertEqual(value, 75);
      });

      test(`Range slider's value should be [30, 65]`, async () => {
        const value = await testEngine.parts.range.getRangeValues();
        assertEqual(value, [30, 65]);
      });

      test.skip(`Setting basic slider's value should change its state`, async () => {
        // TODO: https://github.com/atomic-testing/atomic-testing/issues/73
        await testEngine.parts.basic.setValue(50);
        const value = await testEngine.parts.basic.getValue();
        assertEqual(value, 50);
      });
    });
  },
};
