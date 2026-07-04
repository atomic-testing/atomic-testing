import { IExampleUIUnit } from '@atomic-testing/core';
import { ToggleGroup } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix ToggleGroup scene: a `type="single"` group (role="radiogroup") and a
 * `type="multiple"` group (role="toolbar") — both render the same
 * `data-state="on"/"off"` per-item shape `ToggleGroupDriver` reads, so this
 * proves the driver is selection-mode-agnostic. One item is disabled.
 */
export const ToggleGroupExample = () => (
  <div>
    <ToggleGroup.Root type='single' defaultValue='left' aria-label='Alignment' data-testid='toggle-group-single'>
      <ToggleGroup.Item value='left'>Left</ToggleGroup.Item>
      <ToggleGroup.Item value='center'>Center</ToggleGroup.Item>
      <ToggleGroup.Item value='right' disabled>
        Right
      </ToggleGroup.Item>
    </ToggleGroup.Root>
    <ToggleGroup.Root
      type='multiple'
      defaultValue={['bold']}
      aria-label='Formatting'
      data-testid='toggle-group-multiple'>
      <ToggleGroup.Item value='bold'>Bold</ToggleGroup.Item>
      <ToggleGroup.Item value='italic'>Italic</ToggleGroup.Item>
    </ToggleGroup.Root>
  </div>
);

export const toggleGroupUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix ToggleGroup',
  ui: <ToggleGroupExample />,
};
