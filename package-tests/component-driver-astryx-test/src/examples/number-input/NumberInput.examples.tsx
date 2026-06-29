import { NumberInput } from '@astryxdesign/core/NumberInput';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx NumberInput scene.
 *
 * NumberInput renders an `<input type="number">` (forwarding `data-testid` onto
 * it) with native `min`/`max`/`step` and a trailing units `<span>` sibling.
 */
export const NumberInputExample = () => {
  const [value, setValue] = useState(5);

  return (
    <NumberInput
      label='Quantity'
      value={value}
      onChange={setValue}
      min={0}
      max={10}
      step={2}
      units='kg'
      data-testid='qty-input'
    />
  );
};

export const numberInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx NumberInput',
  ui: <NumberInputExample />,
};
