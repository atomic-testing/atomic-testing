import { createStaticSource, Typeahead } from '@astryxdesign/core/Typeahead';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

type Item = { id: string; label: string };

const fruitSource = createStaticSource<Item>([
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'grape', label: 'Grape' },
  { id: 'cherry', label: 'Cherry' },
]);

const citySource = createStaticSource<Item>([
  { id: 'paris', label: 'Paris' },
  { id: 'prague', label: 'Prague' },
  { id: 'porto', label: 'Porto' },
]);

const FruitTypeahead = () => {
  const [value, setValue] = useState<Item | null>(null);
  return (
    <Typeahead<Item>
      data-testid='fruit-search'
      label='Fruit'
      searchSource={fruitSource}
      value={value}
      onChange={setValue}
      hasClear
    />
  );
};

const CityTypeahead = () => {
  const [value, setValue] = useState<Item | null>(null);
  return (
    <Typeahead<Item>
      data-testid='city-search'
      label='City'
      searchSource={citySource}
      value={value}
      onChange={setValue}
    />
  );
};

/**
 * Astryx Typeahead scene.
 *
 * Typeahead self-emits `data-testid` on the root `<div>`; the `role="combobox"` is
 * the `<input>`, linked to the async results `role="listbox"`. Two typeaheads
 * verify selector scoping.
 */
export const TypeaheadExample = () => (
  <>
    <FruitTypeahead />
    <CityTypeahead />
  </>
);

export const typeaheadUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Typeahead',
  ui: <TypeaheadExample />,
};
