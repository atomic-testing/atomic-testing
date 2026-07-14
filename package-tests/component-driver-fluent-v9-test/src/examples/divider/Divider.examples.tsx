import { IExampleUIUnit } from '@atomic-testing/core';
import { Divider, FluentProvider, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const DividerExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Divider data-testid='divider-horizontal'>OR</Divider>
    <Divider data-testid='divider-vertical' vertical>
      OR
    </Divider>
  </FluentProvider>
);

export const dividerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Divider',
  ui: <DividerExample />,
};
