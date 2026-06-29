import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx ProgressBar scene.
 *
 * The root `<div>` is roleless (it carries `data-testid`/`data-variant`); the ARIA
 * role lives on an inner track that switches between `role="meter"` (determinate,
 * with `aria-value*`) and `role="progressbar"` (indeterminate, no `aria-value*`).
 * The `determinate` instance pins a value; the `indeterminate` instance omits one.
 */
export const ProgressBarExample = () => (
  <div>
    <ProgressBar
      label='Upload progress'
      value={75}
      max={100}
      hasValueLabel
      variant='accent'
      data-testid='progress-determinate'
    />
    <ProgressBar label='Loading...' isIndeterminate data-testid='progress-indeterminate' />
  </div>
);

export const progressBarUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ProgressBar',
  ui: <ProgressBarExample />,
};
