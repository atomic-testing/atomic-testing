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
 * bare `<template>` until the card opens — so the driver hovers and probes for the
 * reveal. The component's own open state drives that mount, so it lands under jsdom
 * as well as in a real browser; what stays E2E-only is whether the revealed layer is
 * actually *visible*, which nothing here asserts.
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
