import { IExampleUIUnit } from '@atomic-testing/core';
import { RadioGroup } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix RadioGroup scene: two independent groups so cross-group bleed shows up
 * (each item's own selection must not affect the other group), plus a disabled
 * item within the first group.
 */
export const RadioGroupExample = () => (
  <div>
    <RadioGroup.Root data-testid='radio-group-one' defaultValue='a' aria-label='Group one'>
      <RadioGroup.Item value='a' data-testid='group-one-a'>
        <RadioGroup.Indicator />
      </RadioGroup.Item>
      <RadioGroup.Item value='b' data-testid='group-one-b'>
        <RadioGroup.Indicator />
      </RadioGroup.Item>
      <RadioGroup.Item value='c' disabled data-testid='group-one-c'>
        <RadioGroup.Indicator />
      </RadioGroup.Item>
    </RadioGroup.Root>
    <RadioGroup.Root data-testid='radio-group-two' aria-label='Group two'>
      <RadioGroup.Item value='x' data-testid='group-two-x'>
        <RadioGroup.Indicator />
      </RadioGroup.Item>
      <RadioGroup.Item value='y' data-testid='group-two-y'>
        <RadioGroup.Indicator />
      </RadioGroup.Item>
    </RadioGroup.Root>
  </div>
);

export const radioGroupUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix RadioGroup',
  ui: <RadioGroupExample />,
};
