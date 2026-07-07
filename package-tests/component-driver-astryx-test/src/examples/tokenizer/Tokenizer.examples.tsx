import { Tokenizer } from '@astryxdesign/core/Tokenizer';
import { createStaticSource } from '@astryxdesign/core/Typeahead';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

type Item = { id: string; label: string };

const fruitSource = createStaticSource<Item>([
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'grape', label: 'Grape' },
  { id: 'cherry', label: 'Cherry' },
]);

const TagTokenizer = () => {
  const [value, setValue] = useState<Item[]>([{ id: 'apple', label: 'Apple' }]);
  return (
    <Tokenizer<Item>
      data-testid='tags'
      label='Tags'
      searchSource={fruitSource}
      value={value}
      onChange={items => setValue(items)}
      hasClear
      hasCreate
    />
  );
};

const PlainTokenizer = () => {
  const [value, setValue] = useState<Item[]>([]);
  return (
    <Tokenizer<Item>
      data-testid='plain-tags'
      label='Plain'
      searchSource={fruitSource}
      value={value}
      onChange={items => setValue(items)}
    />
  );
};

const DisabledTokenizer = () => {
  const [value] = useState<Item[]>([{ id: 'banana', label: 'Banana' }]);
  return (
    <Tokenizer<Item>
      data-testid='disabled-tags'
      label='Disabled'
      searchSource={fruitSource}
      value={value}
      onChange={() => {}}
      isDisabled
      disabledMessage='Tags are locked while the review is in progress'
    />
  );
};

/**
 * Astryx Tokenizer scene.
 *
 * Tokenizer renders a `role="group"` root (self-emitting `data-testid`) holding the
 * token chips and the `role="combobox"` input. `tags` enables `hasClear`/`hasCreate`;
 * a second tokenizer verifies selector scoping. A third, disabled tokenizer carries a
 * `disabledMessage`, exercising `getDisabledMessage`'s resolution through the inner
 * combobox input's `aria-describedby` (Astryx wires the tooltip link there, not onto
 * the `role="group"` root).
 */
export const TokenizerExample = () => (
  <>
    <TagTokenizer />
    <PlainTokenizer />
    <DisabledTokenizer />
  </>
);

export const tokenizerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Tokenizer',
  ui: <TokenizerExample />,
};
