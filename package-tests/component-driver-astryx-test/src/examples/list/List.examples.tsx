import { List, ListItem } from '@astryxdesign/core/List';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx List scene.
 *
 * `List` self-emits `data-testid` on the root `<ul>` (or `<ol>` when
 * `listStyle="decimal"`) and carries `data-list-style`. Rows are `<li>` whose
 * state is on the `<li>` itself: `aria-selected` (selected), `aria-disabled`
 * (disabled), and an inner `<a href>` for links. Two lists — one unordered, one
 * ordered — verify selector scoping and `isOrdered`.
 */
export const ListExample = () => (
  <>
    <List header='Settings' data-testid='settings'>
      <ListItem label='Profile' isSelected />
      <ListItem label='Privacy' />
      <ListItem label='Docs' href='/docs' />
      <ListItem label='Archived' isDisabled />
    </List>
    <List listStyle='decimal' data-testid='steps'>
      <ListItem label='First step' />
      <ListItem label='Second step' />
    </List>
  </>
);

export const listUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx List',
  ui: <ListExample />,
};
