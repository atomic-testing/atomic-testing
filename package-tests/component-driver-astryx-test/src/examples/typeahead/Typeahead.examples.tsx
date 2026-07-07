import { createStaticSource, Typeahead } from '@astryxdesign/core/Typeahead';
import { IExampleUIUnit } from '@atomic-testing/core';
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

const LockedTypeahead = () => (
  <Typeahead<Item>
    data-testid='locked-search'
    label='Assignee'
    searchSource={fruitSource}
    value={null}
    onChange={() => {}}
    isDisabled
    disabledMessage='You need the Editor role to change this'
  />
);

/**
 * Astryx Typeahead scene.
 *
 * Typeahead self-emits `data-testid` on the root `<div>`; the `role="combobox"` is
 * the `<input>`, linked to the async results `role="listbox"`. Two typeaheads
 * verify selector scoping. The "locked" instance is disabled with a
 * `disabledMessage`, so its `<input>` renders a `role="tooltip"` layer reached
 * through the composed `aria-describedby`.
 */
export const TypeaheadExample = () => (
  <>
    <FruitTypeahead />
    <CityTypeahead />
    <LockedTypeahead />
  </>
);

export const typeaheadUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Typeahead',
  ui: <TypeaheadExample />,
};
