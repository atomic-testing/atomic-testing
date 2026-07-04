import { IExampleUIUnit } from '@atomic-testing/core';
import { Toggle } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Toggle scene: an uncontrolled toggle plus a disabled one, covering the
 * pressed/disabled reads per instance.
 */
export const ToggleExample = () => (
  <div>
    <Toggle.Root aria-label='Bold' data-testid='toggle-bold' defaultPressed={false}>
      B
    </Toggle.Root>
    <Toggle.Root aria-label='Italic' data-testid='toggle-disabled' disabled defaultPressed>
      I
    </Toggle.Root>
  </div>
);

export const toggleUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Toggle',
  ui: <ToggleExample />,
};
