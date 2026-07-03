import { IExampleUIUnit } from '@atomic-testing/core';
import { Checkbox, Label } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Checkbox scene: a labeled checkbox (native `<label for>`↔`id` link, the
 * shape `CheckboxDriver.getLabel` resolves), an indeterminate one, and a
 * disabled one — covering the tri-state read and the disabled/label reads a
 * too-broad locator or attribute read would bleed across.
 */
export const CheckboxExample = () => (
  <div>
    <div>
      <Label.Root htmlFor='terms'>Accept terms</Label.Root>
      <Checkbox.Root id='terms' data-testid='checkbox-labeled' defaultChecked={false}>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
    </div>
    <div>
      <Checkbox.Root data-testid='checkbox-indeterminate' defaultChecked='indeterminate'>
        <Checkbox.Indicator forceMount>-</Checkbox.Indicator>
      </Checkbox.Root>
    </div>
    <div>
      <Checkbox.Root data-testid='checkbox-disabled' disabled defaultChecked={false}>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
    </div>
  </div>
);

export const checkboxUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Checkbox',
  ui: <CheckboxExample />,
};
