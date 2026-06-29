import { Thumbnail } from '@astryxdesign/core/Thumbnail';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Thumbnail scene.
 *
 * Thumbnail renders a `<div class="astryx-thumbnail">` (no role) whose `aria-label`
 * is a composite accessible name; its inner content is conditional — an `<img>`
 * when `src` is set, a `.astryx-skeleton` while loading, or an icon placeholder
 * otherwise — and a removable thumbnail adds a `Remove …` button. The scene covers
 * placeholder / image / removable / loading.
 */
export const ThumbnailExample = () => (
  <div>
    <Thumbnail label='file.jpg' data-testid='thumbnail-placeholder' />
    <Thumbnail label='photo.jpg' alt='Vacation photo' src='https://example.com/p.jpg' data-testid='thumbnail-image' />
    <Thumbnail
      label='removable.jpg'
      alt='Removable photo'
      src='https://example.com/r.jpg'
      onRemove={() => {}}
      data-testid='thumbnail-removable'
    />
    <Thumbnail label='loading.jpg' isLoading data-testid='thumbnail-loading' />
  </div>
);

export const thumbnailUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Thumbnail',
  ui: <ThumbnailExample />,
};
