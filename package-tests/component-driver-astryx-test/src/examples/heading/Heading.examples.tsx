import { Heading } from '@astryxdesign/core/Heading';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Heading scene.
 *
 * Heading renders a native `<h1>`–`<h6>` (role `heading`) reflecting the level as
 * `data-level`. The first instance leaves `accessibilityLevel` at its default
 * (no `aria-level` emitted, so accessibility level falls back to `data-level`);
 * the second sets `accessibilityLevel={3}` on a level-2 heading, emitting
 * `aria-level="3"` distinct from the visual level.
 */
export const HeadingExample = () => (
  <div>
    <Heading level={1} data-testid='heading-plain'>
      Page Title
    </Heading>
    <Heading level={2} accessibilityLevel={3} data-testid='heading-aria'>
      Section
    </Heading>
  </div>
);

export const headingUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Heading',
  ui: <HeadingExample />,
};
