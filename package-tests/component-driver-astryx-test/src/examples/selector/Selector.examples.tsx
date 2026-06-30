import { Selector } from '@astryxdesign/core/Selector';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

const FruitSelector = () => {
  const [value, setValue] = useState('banana');
  return (
    <Selector
      data-testid='fruit'
      label='Fruit'
      value={value}
      onChange={setValue}
      options={[
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
      ]}
    />
  );
};

const SizeSelector = () => {
  const [value, setValue] = useState('m');
  return (
    <Selector
      data-testid='size'
      label='Size'
      value={value}
      onChange={setValue}
      options={[
        { value: 's', label: 'Small' },
        { value: 'm', label: 'Medium' },
        { value: 'l', label: 'Large' },
      ]}
    />
  );
};

/**
 * Astryx Selector scene.
 *
 * Selector self-emits `data-testid` on the root `<div>`; the `role="combobox"` sits
 * on an inner `<button>` whose text is the selected label, linked to the popup
 * `role="listbox"` by `aria-controls`. Two single-select selectors verify scoping.
 */
export const SelectorExample = () => (
  <>
    <FruitSelector />
    <SizeSelector />
  </>
);

export const selectorUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Selector',
  ui: <SelectorExample />,
};
