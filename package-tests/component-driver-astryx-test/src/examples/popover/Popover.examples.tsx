import { Button } from '@astryxdesign/core/Button';
import { Popover } from '@astryxdesign/core/Popover';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Popover scene (uncontrolled, so clicking the trigger toggles it).
 *
 * The scene anchors on the trigger `<button>` (the `Button`'s `data-testid`
 * forwards onto it, and Popover augments it with
 * `aria-haspopup="dialog"`/`aria-expanded`/`aria-controls`). The panel renders as
 * a sibling `role="dialog"` carrying the `label` as its `aria-label` and the
 * `content` as its first child.
 */
export const PopoverExample = () => (
  <div>
    <Popover label='Settings' content={<div>Adjust your preferences here.</div>}>
      <Button label='Open settings' data-testid='popover-trigger' />
    </Popover>
  </div>
);

export const popoverUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Popover',
  ui: <PopoverExample />,
};
