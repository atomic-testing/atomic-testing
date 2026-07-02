import { IExampleUIUnit } from '@atomic-testing/core';
import { Slider } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Slider audit scene (Wave 0 capability-gap audit; no driver yet).
 *
 * Inline sizing only — Radix is unstyled, and a zero-size track/thumb would make
 * pointer-based interactions (drag, positional click) untestable in a browser.
 */
export const SliderExample = () => (
  <Slider.Root
    defaultValue={[30]}
    max={100}
    step={5}
    data-testid='slider'
    style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: 200,
      height: 20,
      userSelect: 'none',
      touchAction: 'none',
    }}>
    <Slider.Track
      data-testid='slider-track'
      style={{ position: 'relative', flexGrow: 1, height: 4, backgroundColor: '#ddd' }}>
      <Slider.Range style={{ position: 'absolute', height: '100%', backgroundColor: '#333' }} />
    </Slider.Track>
    <Slider.Thumb
      aria-label='Volume'
      data-testid='slider-thumb'
      style={{ display: 'block', width: 16, height: 16, borderRadius: 8, backgroundColor: '#333' }}
    />
  </Slider.Root>
);

export const sliderUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Slider',
  ui: <SliderExample />,
};
