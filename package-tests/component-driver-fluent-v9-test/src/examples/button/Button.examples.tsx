import { IExampleUIUnit } from '@atomic-testing/core';
import { Button, FluentProvider, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

/**
 * Fluent Button scene: two labeled instances (disambiguation) and a disabled
 * one, wrapped in its own `FluentProvider` since `createTestEngine` renders
 * this element directly, bypassing the app-level provider in `index.tsx`.
 */
export const ButtonExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Button data-testid='button-one'>One</Button>
    <Button data-testid='button-two'>Two</Button>
    <Button data-testid='button-disabled' disabled>
      Disabled
    </Button>
  </FluentProvider>
);

export const buttonUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Button',
  ui: <ButtonExample />,
};
