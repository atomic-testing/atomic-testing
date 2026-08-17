import { Thumbnail } from '@astryxdesign/core/Thumbnail';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * A 1×1 transparent GIF, inline. Every `src` in this scene is a `data:` URI on
 * purpose: Astryx 0.3.0 gave Thumbnail an `onError` handler that swaps a failed
 * image for the placeholder, which turned the fake `https://example.com/…` URLs
 * this scene used to carry into a **network-dependent** assertion — the image
 * resolves or not depending on the runner's egress, and the placeholder swap then
 * races the assertion. jsdom never fetches at all, so it stayed green while WebKit
 * (which fires `error` fastest) went red and Chromium passed by luck. An inline
 * image removes the network from the question entirely.
 */
export const LOADED_IMAGE_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * Well-formed as a URI, not decodable as a PNG — so the decode fails locally, with
 * no network involved, and `onError` fires deterministically in every engine. This
 * is what exercises the 0.3.0 fallback rather than leaving it to chance.
 */
const BROKEN_IMAGE_SRC = 'data:image/png;base64,Zm9v';

/**
 * Astryx Thumbnail scene.
 *
 * Thumbnail renders a `<div class="astryx-thumbnail">` (no role) whose `aria-label`
 * is a composite accessible name; its inner content is conditional — an `<img>`
 * when `src` is set and loads, a `.astryx-skeleton` while loading, or an icon
 * placeholder otherwise — and a removable thumbnail adds a `Remove …` button. The
 * scene covers placeholder / image / removable / loading, plus the failed-image
 * fallback Astryx 0.3.0 added.
 */
export const ThumbnailExample = () => (
  <div>
    <Thumbnail label='file.jpg' data-testid='thumbnail-placeholder' />
    <Thumbnail label='photo.jpg' alt='Vacation photo' src={LOADED_IMAGE_SRC} data-testid='thumbnail-image' />
    <Thumbnail
      label='removable.jpg'
      alt='Removable photo'
      src={LOADED_IMAGE_SRC}
      onRemove={() => {}}
      data-testid='thumbnail-removable'
    />
    <Thumbnail label='loading.jpg' isLoading data-testid='thumbnail-loading' />
    <Thumbnail label='broken.jpg' alt='Broken photo' src={BROKEN_IMAGE_SRC} data-testid='thumbnail-broken' />
  </div>
);

export const thumbnailUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Thumbnail',
  ui: <ThumbnailExample />,
};
