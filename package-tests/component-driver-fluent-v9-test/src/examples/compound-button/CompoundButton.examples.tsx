import { IExampleUIUnit } from '@atomic-testing/core';
import { CompoundButton, FluentProvider, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const CompoundButtonExample = () => (
  <FluentProvider theme={webLightTheme}>
    <CompoundButton data-testid='compound-button-with-secondary' secondaryContent='Secondary text'>
      Primary text
    </CompoundButton>
    <CompoundButton data-testid='compound-button-bare'>Bare</CompoundButton>
  </FluentProvider>
);

export const compoundButtonUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent CompoundButton',
  ui: <CompoundButtonExample />,
};
