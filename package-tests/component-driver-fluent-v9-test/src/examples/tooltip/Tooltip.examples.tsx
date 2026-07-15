import { IExampleUIUnit } from '@atomic-testing/core';
import { Button, FluentProvider, Tooltip, webLightTheme } from '@fluentui/react-components';
import React, { JSX } from 'react';

/**
 * `showDelay={0}`/`hideDelay={0}` on both triggers: with Fluent's default
 * (non-zero) delays, opening/closing is timer-bound — keeping the delay at
 * zero here makes the shared jsdom suite deterministic; real-delay behavior is
 * an E2E-only concern (see `docs/docs/guides/portal-and-overlays.md`).
 */
export const TooltipExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Tooltip content='Save the current document' relationship='label' showDelay={0} hideDelay={0}>
      <Button data-testid='tooltip-label-trigger'>Save</Button>
    </Tooltip>

    <Tooltip content='Extra detail about this field' relationship='description' showDelay={0} hideDelay={0}>
      <Button data-testid='tooltip-description-trigger'>Field</Button>
    </Tooltip>

    <Button data-testid='tooltip-none-trigger'>No tooltip</Button>
  </FluentProvider>
);

export const tooltipUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Tooltip',
  ui: <TooltipExample />,
};
