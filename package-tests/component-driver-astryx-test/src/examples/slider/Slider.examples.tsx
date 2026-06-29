import { Slider } from '@astryxdesign/core/Slider';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx Slider scene (single thumb).
 *
 * Astryx puts `role="slider"` on the THUMB; the root forwards `data-testid`. The
 * value is exposed via `aria-valuenow` and driven by the keyboard (Arrow keys) —
 * `step={10}` keeps the keyboard-stepping test short.
 */
export const SliderExample = () => {
  const [volume, setVolume] = useState(50);

  return (
    <Slider
      label='Volume'
      value={volume}
      onChange={setVolume}
      min={0}
      max={100}
      step={10}
      data-testid='volume-slider'
    />
  );
};

export const sliderUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Slider',
  ui: <SliderExample />,
};
