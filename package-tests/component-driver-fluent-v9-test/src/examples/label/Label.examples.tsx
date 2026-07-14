import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Label, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const LabelExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Label data-testid='label-linked' htmlFor='some-control'>
      Linked label
    </Label>
    <Label data-testid='label-unlinked'>Unlinked label</Label>
  </FluentProvider>
);

export const labelUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Label',
  ui: <LabelExample />,
};
