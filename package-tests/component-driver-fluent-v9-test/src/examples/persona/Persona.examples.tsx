import { IExampleUIUnit } from '@atomic-testing/core';
import { FluentProvider, Persona, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const PersonaExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Persona
      data-testid='persona-plain'
      name='Kevin Sturgis'
      secondaryText='Software Engineer'
      presence={{ status: 'available' }}
    />
    <Persona data-testid='persona-presence-only' name='Away User' presenceOnly presence={{ status: 'busy' }} />
  </FluentProvider>
);

export const personaUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Persona',
  ui: <PersonaExample />,
};
