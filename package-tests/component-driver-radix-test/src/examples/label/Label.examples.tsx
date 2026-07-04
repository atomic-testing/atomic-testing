import { IExampleUIUnit } from '@atomic-testing/core';
import { Label } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Label scene: two labels, each linked to its own input by `for`/`id`,
 * so a too-broad `getFor` read shows up as cross-instance bleed.
 */
export const LabelExample = () => (
  <div>
    <Label.Root htmlFor='first-name' data-testid='label-first-name'>
      First name
    </Label.Root>
    <input id='first-name' />
    <Label.Root htmlFor='last-name' data-testid='label-last-name'>
      Last name
    </Label.Root>
    <input id='last-name' />
  </div>
);

export const labelUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Label',
  ui: <LabelExample />,
};
