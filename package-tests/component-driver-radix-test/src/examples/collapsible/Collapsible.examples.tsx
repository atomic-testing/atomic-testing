import { IExampleUIUnit } from '@atomic-testing/core';
import { Collapsible } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Collapsible scene: a closed instance and an open one, so a too-broad
 * trigger locator (matching a button in the content instead of the trigger)
 * shows up as cross-instance bleed.
 */
export const CollapsibleExample = () => (
  <div>
    <Collapsible.Root defaultOpen={false} data-testid='collapsible-closed'>
      <Collapsible.Trigger>Show details</Collapsible.Trigger>
      <Collapsible.Content>
        Details content
        <button type='button'>Inner action</button>
      </Collapsible.Content>
    </Collapsible.Root>
    <Collapsible.Root defaultOpen data-testid='collapsible-open'>
      <Collapsible.Trigger>Show more</Collapsible.Trigger>
      <Collapsible.Content>More content</Collapsible.Content>
    </Collapsible.Root>
  </div>
);

export const collapsibleUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Collapsible',
  ui: <CollapsibleExample />,
};
