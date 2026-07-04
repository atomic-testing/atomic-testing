import { IExampleUIUnit } from '@atomic-testing/core';
import { HoverCard } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix HoverCard scene (Wave 3, #1005). The content is portalled to
 * `document.body`; `openDelay={0}`/`closeDelay={0}` keep hover probes
 * deterministic (the default 700ms/300ms delays are a consumer styling choice,
 * not part of the DOM contract under test).
 */
export const HoverCardExample = () => (
  <HoverCard.Root openDelay={0} closeDelay={0}>
    <HoverCard.Trigger data-testid='hover-card-trigger' href='https://github.com/radix-ui'>
      @radix-ui
    </HoverCard.Trigger>
    <HoverCard.Portal>
      <HoverCard.Content
        data-testid='hover-card-content'
        style={{ backgroundColor: 'white', border: '1px solid #888', padding: 8 }}>
        Radix Primitives — unstyled, accessible components.
        <HoverCard.Arrow />
      </HoverCard.Content>
    </HoverCard.Portal>
  </HoverCard.Root>
);

export const hoverCardUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix HoverCard',
  ui: <HoverCardExample />,
};
