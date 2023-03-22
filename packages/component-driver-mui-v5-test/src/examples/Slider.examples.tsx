import { SliderDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { Slider, Stack } from '@mui/material';
import React from 'react';

//#region slider
export const BasicSlider: React.FunctionComponent = () => {
  const [rangeValues, setRangeValues] = React.useState([30, 65]);

  const handleRangeChange = (event: Event, newValue: number | number[]) => {
    setRangeValues(newValue as number[]);
  };

  return (
    <Stack direction="column">
      <Slider data-testid="basic" defaultValue={75} />
      <Slider data-testid="disabled" disabled value={75} />
      <Slider data-testid="range" value={rangeValues} onChange={handleRangeChange} />
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

export const sliderExamples = [basicSliderExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
