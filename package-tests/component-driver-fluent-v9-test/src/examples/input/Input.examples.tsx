import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Input, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const InputExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Input data-testid='input-one' defaultValue='one' />
    <Input data-testid='input-two' defaultValue='two' />
    <Input data-testid='input-disabled' disabled />
    <Input data-testid='input-required' required />
    <Input data-testid='input-invalid' aria-invalid='true' />
  </FluentProvider>
);

export const inputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Input',
  ui: <InputExample />,
};
