import { Avatar } from '@astryxdesign/core/Avatar';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * A 1×1 transparent PNG as a data URI. Used instead of an `http(s)` URL so the
 * image actually LOADS in a real browser — a broken URL fires Avatar's `onError`,
 * which swaps to the initials fallback and removes the `<img>` (jsdom never fires
 * `onError`, so that divergence only bites E2E). A data URI keeps `hasImage` true
 * in both worlds.
 */
export const avatarImageSrc =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

/**
 * Astryx Avatar scene.
 *
 * Avatar renders a `<div role="img">` whose accessible name is its `aria-label`
 * (`alt || name || 'Avatar'`); its inner content is conditional — an `<img>` when
 * `src` is set, otherwise initials (from `name`) or an icon. The scene renders an
 * initials avatar, an image avatar, and an icon avatar to cover those branches.
 *
 * A fourth avatar covers Astryx 0.1.9's `tooltip` prop with a **custom string**
 * (not the default name-on-hover tooltip): only that case wires `aria-describedby`
 * to the tooltip's `role="tooltip"` layer — the default omits it to avoid
 * double-announcing the name already in `aria-label` — so this is the branch
 * {@link AvatarDriver.getTooltipText} can actually read.
 */
export const AvatarExample = () => (
  <div>
    <Avatar name='John Doe' data-testid='avatar-initials' />
    <Avatar src={avatarImageSrc} alt='Jane Smith photo' data-testid='avatar-image' />
    <Avatar data-testid='avatar-icon' />
    <Avatar name='Ada Lovelace' tooltip='Staff Engineer' data-testid='avatar-tooltip' />
  </div>
);

export const avatarUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Avatar',
  ui: <AvatarExample />,
};
