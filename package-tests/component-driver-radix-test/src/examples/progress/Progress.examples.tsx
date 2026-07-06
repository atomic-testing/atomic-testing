import { IExampleUIUnit } from '@atomic-testing/core';
import { Progress } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Progress scene: a determinate progress bar (`value={40}`) and an
 * indeterminate one (`value={null}`), covering the `data-state` distinction
 * `ProgressDriver.isIndeterminate` reads.
 */
export const ProgressExample = () => (
  <div>
    <Progress.Root value={40} max={100} data-testid='progress-determinate'>
      <Progress.Indicator />
    </Progress.Root>
    <Progress.Root value={null} data-testid='progress-indeterminate'>
      <Progress.Indicator />
    </Progress.Root>
  </div>
);

export const progressUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Progress',
  ui: <ProgressExample />,
};
