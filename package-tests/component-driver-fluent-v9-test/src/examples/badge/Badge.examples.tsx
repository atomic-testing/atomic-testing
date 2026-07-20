import { IExampleUIUnit } from '@atomic-testing/core';
import { Badge, CounterBadge, FluentProvider, PresenceBadge, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const BadgeExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Badge data-testid='badge-plain'>New</Badge>
    <CounterBadge data-testid='counter-badge' count={5} />
    <CounterBadge data-testid='counter-badge-overflow' count={150} overflowCount={99} />
    <PresenceBadge data-testid='presence-badge' status='busy' />
  </FluentProvider>
);

export const badgeUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Badge',
  ui: <BadgeExample />,
};
