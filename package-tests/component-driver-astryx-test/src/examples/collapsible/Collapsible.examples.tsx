import { Collapsible } from '@astryxdesign/core/Collapsible';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Collapsible scene.
 *
 * Collapsible self-emits `data-testid` on its root and renders a trigger
 * `<button aria-expanded>` (label + chevron) followed by the content. Starts
 * collapsed (`defaultIsOpen={false}`) so the expand/collapse flow is observable.
 */
export const CollapsibleExample = () => (
  <Collapsible trigger='Details' defaultIsOpen={false} data-testid='details'>
    Hidden content
  </Collapsible>
);

export const collapsibleUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Collapsible',
  ui: <CollapsibleExample />,
};
