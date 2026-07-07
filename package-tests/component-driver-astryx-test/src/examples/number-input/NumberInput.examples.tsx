import { NumberInput } from '@astryxdesign/core/NumberInput';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx NumberInput scene.
 *
 * NumberInput renders an `<input type="number">` (forwarding `data-testid` onto
 * it) with native `min`/`max`/`step` and a trailing units `<span>` sibling.
 *
 * A second, disabled input carries a `disabledMessage`, exercising
 * `getDisabledMessage`'s resolution of the tooltip id out of the composed
 * `aria-describedby` list.
 */
export const NumberInputExample = () => {
  const [value, setValue] = useState(5);
  const [price, setPrice] = useState(100);

  return (
    <div>
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
      <NumberInput
        label='Price'
        value={price}
        onChange={setPrice}
        data-testid='price-input'
        isDisabled
        disabledMessage='Pricing is locked while the order is processing'
      />
    </div>
  );
};

export const numberInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx NumberInput',
  ui: <NumberInputExample />,
};
