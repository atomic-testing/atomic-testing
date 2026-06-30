import { Avatar } from '@astryxdesign/core/Avatar';
import { AvatarGroup, AvatarGroupOverflow } from '@astryxdesign/core/AvatarGroup';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx AvatarGroup scene.
 *
 * AvatarGroup renders a `<div role="group" aria-label="Avatars">`; each visible
 * avatar is a descendant `[role="img"]` carrying its own `aria-label`, and an
 * optional `AvatarGroupOverflow` chip reports the hidden count. The scene renders
 * one group with an overflow chip and one without, to cover overflow / no-overflow.
 */
export const AvatarGroupExample = () => (
  <div>
    <AvatarGroup size='small' data-testid='avatar-group-overflow'>
      <Avatar name='John Doe' data-testid='ag-overflow-avatar-1' />
      <Avatar name='Jane Smith' data-testid='ag-overflow-avatar-2' />
      <Avatar name='Sam Lee' data-testid='ag-overflow-avatar-3' />
      <AvatarGroupOverflow count={5} />
    </AvatarGroup>
    <AvatarGroup size='small' data-testid='avatar-group-plain'>
      <Avatar name='Alice Wong' data-testid='ag-plain-avatar-1' />
      <Avatar name='Bob Carter' data-testid='ag-plain-avatar-2' />
    </AvatarGroup>
  </div>
);

export const avatarGroupUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx AvatarGroup',
  ui: <AvatarGroupExample />,
};
