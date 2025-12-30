import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
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

/**
 * Basic Slider example from MUI's website
 * @see https://mui.com/material-ui/react-slider
 */
export const basicSliderUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Slider',
  ui: <BasicSlider />,
};
//#endregion
