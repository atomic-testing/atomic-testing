import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Slider, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const SliderExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Slider data-testid='slider-a' defaultValue={20} min={0} max={50} step={5} aria-label='Volume A' />
    <Slider data-testid='slider-b' defaultValue={70} min={10} max={100} step={10} />
    <Slider data-testid='slider-disabled' defaultValue={30} disabled />
    <Slider data-testid='slider-required' defaultValue={15} required />
  </FluentProvider>
);

export const sliderUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Slider',
  ui: <SliderExample />,
};
