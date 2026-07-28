import { Collapsible } from '@astryxdesign/core/Collapsible';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx Collapsible scene.
 *
 * Collapsible self-emits `data-testid` on its root and renders a trigger
 * `<button aria-expanded>` (label + chevron) followed by the content. Starts
 * collapsed (`defaultIsOpen={false}`) so the expand/collapse flow is observable.
 * A second, disabled instance covers Astryx 0.1.8's `isDisabled` prop — the
 * trigger keeps `aria-expanded` but adds `aria-disabled="true"` and drops out of
 * the tab order, staying collapsed since the component itself blocks the toggle.
 */
export const CollapsibleExample = () => (
  <div>
    <Collapsible trigger='Details' defaultIsOpen={false} data-testid='details'>
      Hidden content
    </Collapsible>
    <Collapsible trigger='Disabled section' isDisabled defaultIsOpen={false} data-testid='details-disabled'>
      Unreachable content
    </Collapsible>
  </div>
);

export const collapsibleUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Collapsible',
  ui: <CollapsibleExample />,
};
