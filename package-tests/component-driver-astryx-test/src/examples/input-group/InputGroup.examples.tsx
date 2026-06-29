import { InputGroup, InputGroupText } from '@astryxdesign/core/InputGroup';
import { TextInput } from '@astryxdesign/core/TextInput';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx InputGroup scene.
 *
 * InputGroup self-emits `data-testid` on its inner `role="group"` div (which also
 * carries the accessible name). A prefix `InputGroupText` ("$") and a suffix
 * ("USD") flank the input — the addons the driver reads, on both sides to prove
 * a trailing addon is not dropped.
 */
export const InputGroupExample = () => {
  const [price, setPrice] = useState('');

  return (
    <InputGroup label='Price' data-testid='price-group'>
      <InputGroupText>$</InputGroupText>
      <TextInput label='Price' isLabelHidden value={price} onChange={v => setPrice(v)} />
      <InputGroupText>USD</InputGroupText>
    </InputGroup>
  );
};

export const inputGroupUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx InputGroup',
  ui: <InputGroupExample />,
};
