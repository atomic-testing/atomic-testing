import { IExampleUIUnit } from '@atomic-testing/core';
import { Slider } from 'radix-ui';
import React, { JSX } from 'react';

const trackStyle: React.CSSProperties = { position: 'relative', flexGrow: 1, height: 4, backgroundColor: '#ddd' };
const rangeStyle: React.CSSProperties = { position: 'absolute', height: '100%', backgroundColor: '#333' };
const rootStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: 200,
  height: 20,
  userSelect: 'none',
  touchAction: 'none',
};
const thumbStyle: React.CSSProperties = {
  display: 'block',
  width: 16,
  height: 16,
  borderRadius: 8,
  backgroundColor: '#333',
};

/**
 * Radix Slider scene (originally built for the Wave 0 capability-gap audit;
 * extended for the Wave 4 SliderDriver with a disabled variant so `isDisabled`
 * has something to assert against).
 *
 * Inline sizing only — Radix is unstyled, and a zero-size track/thumb would make
 * pointer-based interactions (drag, positional click) untestable in a browser.
 */
export const SliderExample = () => (
  <>
    <Slider.Root defaultValue={[30]} max={100} step={5} data-testid='slider' style={rootStyle}>
      <Slider.Track data-testid='slider-track' style={trackStyle}>
        <Slider.Range style={rangeStyle} />
      </Slider.Track>
      <Slider.Thumb aria-label='Volume' data-testid='slider-thumb' style={thumbStyle} />
    </Slider.Root>
    <Slider.Root disabled defaultValue={[30]} max={100} step={5} data-testid='slider-disabled' style={rootStyle}>
      <Slider.Track data-testid='slider-disabled-track' style={trackStyle}>
        <Slider.Range style={rangeStyle} />
      </Slider.Track>
      <Slider.Thumb aria-label='Volume' data-testid='slider-disabled-thumb' style={thumbStyle} />
    </Slider.Root>
  </>
);

export const sliderUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Slider',
  ui: <SliderExample />,
};
