import { IExampleUIUnit } from '@atomic-testing/core';
import { ColorSwatch, FluentProvider, SwatchPicker, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const SwatchPickerExample = () => (
  <FluentProvider theme={webLightTheme}>
    <SwatchPicker data-testid='swatch-picker-one' aria-label='Pick a color' defaultSelectedValue='red'>
      <ColorSwatch data-testid='swatch-one-red' value='red' color='#D13438' aria-label='Red' />
      <ColorSwatch data-testid='swatch-one-green' value='green' color='#107C10' aria-label='Green' />
      <ColorSwatch data-testid='swatch-one-blue' value='blue' color='#0078D4' aria-label='Blue' />
      <ColorSwatch data-testid='swatch-one-yellow' value='yellow' color='#FFB900' aria-label='Yellow' />
      <ColorSwatch
        data-testid='swatch-one-disabled'
        value='unavailable'
        color='#8A8886'
        aria-label='Unavailable'
        disabled
      />
    </SwatchPicker>
    <SwatchPicker data-testid='swatch-picker-two' aria-label='Pick another color'>
      <ColorSwatch data-testid='swatch-two-red' value='red' color='#D13438' aria-label='Red' />
      <ColorSwatch data-testid='swatch-two-green' value='green' color='#107C10' aria-label='Green' />
    </SwatchPicker>
  </FluentProvider>
);

export const swatchPickerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent SwatchPicker',
  ui: <SwatchPickerExample />,
};
