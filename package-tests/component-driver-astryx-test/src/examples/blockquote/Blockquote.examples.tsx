import { Blockquote } from '@astryxdesign/core/Blockquote';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Blockquote scene.
 *
 * Blockquote renders a semantic `<blockquote>` (no role). With a `cite` it appends
 * a `<footer><cite>…</cite></footer>`; without one no `<cite>` exists. The two
 * instances cover the cited and uncited (citation → `undefined`) cases.
 */
export const BlockquoteExample = () => (
  <div>
    <Blockquote data-testid='blockquote-cited' cite='Steve Jobs'>
      Design is not just what it looks like.
    </Blockquote>
    <Blockquote data-testid='blockquote-plain'>Stay hungry, stay foolish.</Blockquote>
  </div>
);

export const blockquoteUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Blockquote',
  ui: <BlockquoteExample />,
};
