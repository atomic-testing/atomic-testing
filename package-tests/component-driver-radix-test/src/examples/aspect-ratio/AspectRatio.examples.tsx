import { IExampleUIUnit } from '@atomic-testing/core';
import { AspectRatio } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix AspectRatio scene: a 16:9 and a 1:1 ratio, so a mis-parsed
 * `padding-bottom` shows up as cross-instance bleed.
 *
 * `AspectRatio.Root` forwards arbitrary props (like `data-testid`) onto its
 * INNER absolutely-positioned content div, not the outer wrapper that carries
 * the ratio-encoding `padding-bottom` — so `data-testid` is placed on the
 * surrounding sizing `<div>` here, and the scene descends to Radix's own
 * `data-radix-aspect-ratio-wrapper` attribute to reach the ratio-bearing
 * element (see `AspectRatioDriver`'s doc comment).
 */
export const AspectRatioExample = () => (
  <div>
    <div style={{ width: 300 }} data-testid='aspect-ratio-widescreen'>
      <AspectRatio.Root ratio={16 / 9}>
        <img src='widescreen.png' alt='widescreen' style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      </AspectRatio.Root>
    </div>
    <div style={{ width: 300 }} data-testid='aspect-ratio-square'>
      <AspectRatio.Root ratio={1}>
        <img src='square.png' alt='square' style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      </AspectRatio.Root>
    </div>
  </div>
);

export const aspectRatioUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix AspectRatio',
  ui: <AspectRatioExample />,
};
