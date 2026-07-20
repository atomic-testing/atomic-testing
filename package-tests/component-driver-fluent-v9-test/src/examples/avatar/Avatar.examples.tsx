import { IExampleUIUnit } from '@atomic-testing/core';
import { Avatar, AvatarGroup, AvatarGroupItem, FluentProvider, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

export const AvatarExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Avatar data-testid='avatar-plain' name='Kevin Sturgis' />
    <Avatar data-testid='avatar-with-badge' name='No Image' badge={{ status: 'busy' }} />
    <AvatarGroup data-testid='avatar-group'>
      <AvatarGroupItem name='Person One' key='1' />
      <AvatarGroupItem name='Person Two' key='2' />
    </AvatarGroup>
  </FluentProvider>
);

export const avatarUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Avatar',
  ui: <AvatarExample />,
};
