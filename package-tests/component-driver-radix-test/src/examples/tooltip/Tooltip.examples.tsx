import { IExampleUIUnit } from '@atomic-testing/core';
import { Tooltip } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Tooltip audit scene (Wave 0 portal-recipe audit; no driver yet).
 * The content is portalled to `document.body`; `delayDuration={0}` keeps hover
 * probes deterministic.
 */
export const TooltipExample = () => (
  <Tooltip.Provider delayDuration={0}>
    <Tooltip.Root>
      <Tooltip.Trigger data-testid='tooltip-trigger'>Hover me</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content data-testid='tooltip-content' style={{ backgroundColor: 'black', color: 'white', padding: 4 }}>
          Tooltip body
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export const tooltipUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Tooltip',
  ui: <TooltipExample />,
};
