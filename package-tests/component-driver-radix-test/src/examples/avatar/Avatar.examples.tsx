import { IExampleUIUnit } from '@atomic-testing/core';
import { Avatar } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Avatar scene: two avatars with no `src`, so `Avatar.Image` never
 * attempts to load and the fallback renders deterministically in both jsdom
 * and a real browser. This intentionally does not cover the loaded-image
 * path — see `AvatarDriver`'s doc comment: jsdom has no image decode/network
 * stack, so `hasImage()===true` is only reachable in a real browser, and this
 * shared suite only asserts what is true identically in both environments.
 */
export const AvatarExample = () => (
  <div>
    <Avatar.Root data-testid='avatar-jd'>
      <Avatar.Image alt='Jane Doe' />
      <Avatar.Fallback>JD</Avatar.Fallback>
    </Avatar.Root>
    <Avatar.Root data-testid='avatar-ab'>
      <Avatar.Image alt='Alex Brown' />
      <Avatar.Fallback>AB</Avatar.Fallback>
    </Avatar.Root>
  </div>
);

export const avatarUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Avatar',
  ui: <AvatarExample />,
};
