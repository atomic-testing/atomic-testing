import { IExampleUIUnit } from '@atomic-testing/core';
import { Checkbox, FluentProvider, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const CheckboxExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Checkbox data-testid='checkbox-labeled' label='Accept terms' defaultChecked={false} />
    <Checkbox data-testid='checkbox-unlabeled' defaultChecked={false} />
    <Checkbox data-testid='checkbox-disabled' label='Disabled' disabled />
    <Checkbox data-testid='checkbox-required' label='Required' required />
    <Checkbox data-testid='checkbox-mixed' label='Mixed' defaultChecked='mixed' />
  </FluentProvider>
);

export const checkboxUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Checkbox',
  ui: <CheckboxExample />,
};
