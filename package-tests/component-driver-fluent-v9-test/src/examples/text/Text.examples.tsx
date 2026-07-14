import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Text, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const TextExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Text data-testid='text-one'>One</Text>
    <Text data-testid='text-two'>Two</Text>
  </FluentProvider>
);

export const textUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Text',
  ui: <TextExample />,
};
