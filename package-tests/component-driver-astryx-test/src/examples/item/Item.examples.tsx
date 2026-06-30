import { Item } from '@astryxdesign/core/Item';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Item scene.
 *
 * Item renders the tag chosen by `as` (default `<div>`, also `<li>`), carrying
 * `data-density`/`data-align` and `data-testid` on the root. `aria-selected` is
 * emitted only on an `<li>` root. The `basic` instance is a plain `<div>`; the
 * `selected` instance is an `<li>` marked selected so the driver can read
 * `aria-selected`.
 */
export const ItemExample = () => (
  <div>
    <Item label='John Doe' description='Software Engineer' data-testid='item-basic' />
    <ul>
      <Item as='li' label='Jane Smith' isSelected data-testid='item-li' />
    </ul>
  </div>
);

export const itemUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Item',
  ui: <ItemExample />,
};
