import { Tokenizer } from '@astryxdesign/core/Tokenizer';
import { createStaticSource } from '@astryxdesign/core/Typeahead';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
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

/**
 * Astryx Tokenizer scene.
 *
 * Tokenizer renders a `role="group"` root (self-emitting `data-testid`) holding the
 * token chips and the `role="combobox"` input. `tags` enables `hasClear`/`hasCreate`;
 * a second tokenizer verifies selector scoping.
 */
export const TokenizerExample = () => (
  <>
    <TagTokenizer />
    <PlainTokenizer />
  </>
);

export const tokenizerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Tokenizer',
  ui: <TokenizerExample />,
};
