import { Tooltip } from '@astryxdesign/core/Tooltip';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Tooltip scene.
 *
 * Like HoverCard, the tooltip layer is a body-level popover with no role/testid/
 * open-state; the trigger's injected `aria-describedby` → the layer's `id` is the
 * only stable link. The scene anchors on the trigger (`data-testid`); the driver
 * follows that link to read the tooltip text. The layer stays mounted in jsdom, so
 * content reads in both states — open/visibility is E2E-only and not asserted.
 */
export const TooltipExample = () => (
  <Tooltip content='Helpful tooltip text'>
    <button data-testid='tt-trigger'>Hover me</button>
  </Tooltip>
);

export const tooltipUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Tooltip',
  ui: <TooltipExample />,
};
