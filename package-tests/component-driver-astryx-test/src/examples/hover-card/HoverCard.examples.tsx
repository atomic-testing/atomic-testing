import { HoverCard } from '@astryxdesign/core/HoverCard';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx HoverCard scene.
 *
 * The floating layer is a body-level popover with no role/testid/open-state; the
 * only stable link is the trigger's injected `aria-describedby` → the layer's `id`.
 * The scene anchors on the trigger (`data-testid`); the driver follows that link to
 * read the layer's content. The layer stays mounted in jsdom (no native Popover API),
 * so content reads in both states — but open/visibility is E2E-only and not asserted.
 */
export const HoverCardExample = () => (
  <HoverCard content={<div>Hover card content</div>}>
    <button data-testid='hc-trigger'>Hover me</button>
  </HoverCard>
);

export const hoverCardUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx HoverCard',
  ui: <HoverCardExample />,
};
