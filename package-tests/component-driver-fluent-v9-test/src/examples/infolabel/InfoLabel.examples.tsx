import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, InfoButton, InfoLabel, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const InfoLabelExample = () => (
  <FluentProvider theme={webLightTheme}>
    <InfoLabel data-testid='info-label' info='Extra detail text'>
      Field label
    </InfoLabel>
    <InfoButton data-testid='info-button' info='Button detail text' />
  </FluentProvider>
);

export const infoLabelUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent InfoLabel',
  ui: <InfoLabelExample />,
};
