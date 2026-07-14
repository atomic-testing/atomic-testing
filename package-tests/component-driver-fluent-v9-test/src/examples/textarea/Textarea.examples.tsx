import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Textarea, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const TextareaExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Textarea data-testid='textarea-one' defaultValue='one' />
    <Textarea data-testid='textarea-two' defaultValue='two' />
    <Textarea data-testid='textarea-disabled' disabled />
  </FluentProvider>
);

export const textareaUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Textarea',
  ui: <TextareaExample />,
};
