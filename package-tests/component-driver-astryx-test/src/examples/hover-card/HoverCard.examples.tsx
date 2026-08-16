import { HoverCard } from '@astryxdesign/core/HoverCard';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx HoverCard scene.
 *
 * The floating layer is a body-level popover with no role/testid/open-state; the
 * only stable link is the trigger's injected `aria-describedby` → the layer's `id`.
 * The scene anchors on the trigger (`data-testid`); the driver follows that link to
 * read the layer's content. Since Astryx 0.4.2 the layer is `lazyMount`ed — it is a
 * bare `<template>` until the native popover opens — so the content is only
 * observable in the E2E run, and open/visibility remains E2E-only too.
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
