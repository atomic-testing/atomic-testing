import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Image, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const ImageExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Image data-testid='image-one' src='/one.png' alt='One' />
    <Image data-testid='image-two' src='/two.png' alt='Two' />
    <Image data-testid='image-decorative' src='/decorative.png' />
  </FluentProvider>
);

export const imageUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Image',
  ui: <ImageExample />,
};
