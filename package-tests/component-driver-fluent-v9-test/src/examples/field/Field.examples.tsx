import { IExampleUIUnit } from '@atomic-testing/core';
import { Field, FluentProvider, Input, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const FieldExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Field
      data-testid='field-full'
      label='Full field'
      hint='A helpful hint'
      validationMessage='An error'
      validationState='error'
      required>
      <Input />
    </Field>
    <Field data-testid='field-bare' label='Bare field'>
      <Input />
    </Field>
  </FluentProvider>
);

export const fieldUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Field',
  ui: <FieldExample />,
};
