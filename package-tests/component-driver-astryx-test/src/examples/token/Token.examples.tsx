import { Token } from '@astryxdesign/core/Token';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Token scene.
 *
 * Token's root tag is conditional — a `<span>` by default, an `<a href>` when an
 * `href` is supplied — with the label nested in an inner `<span>` and the color in
 * `data-color`. The scene renders a basic chip, a removable one (renders a
 * `Remove …` button), and a link to cover label / removable / link.
 */
export const TokenExample = () => (
  <div>
    <Token label='Tag' data-testid='token-basic' />
    <Token label='Removable' onRemove={() => {}} data-testid='token-removable' />
    <Token label='Link' href='/destination' data-testid='token-link' />
  </div>
);

export const tokenUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Token',
  ui: <TokenExample />,
};
