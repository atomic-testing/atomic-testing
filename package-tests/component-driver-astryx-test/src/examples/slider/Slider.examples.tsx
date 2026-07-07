import { Slider } from '@astryxdesign/core/Slider';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx Slider scene (single thumb).
 *
 * Astryx puts `role="slider"` on the THUMB; the root forwards `data-testid`. The
 * value is exposed via `aria-valuenow` and driven by the keyboard (Arrow keys) —
 * `step={10}` keeps the keyboard-stepping test short. The second slider is
 * disabled with a `disabledMessage`, reaching a `role="tooltip"` layer through
 * the thumb's composed `aria-describedby`.
 */
export const SliderExample = () => {
  const [volume, setVolume] = useState(50);

  return (
    <div>
      <Slider
        label='Volume'
        value={volume}
        onChange={setVolume}
        min={0}
        max={100}
        step={10}
        data-testid='volume-slider'
      />
      <Slider
        label='Screen-share volume'
        value={50}
        onChange={() => {}}
        isDisabled
        disabledMessage='Volume is locked while sharing your screen'
        data-testid='locked-slider'
      />
    </div>
  );
};

export const sliderUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Slider',
  ui: <SliderExample />,
};
