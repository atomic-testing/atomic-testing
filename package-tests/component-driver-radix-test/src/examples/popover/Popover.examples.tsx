import { IExampleUIUnit } from '@atomic-testing/core';
import { Popover } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Popover audit scene (Wave 0 portal-recipe audit; no driver yet).
 * The content is portalled to `document.body`.
 */
export const PopoverExample = () => (
  <Popover.Root>
    <Popover.Trigger data-testid='popover-trigger'>Toggle popover</Popover.Trigger>
    <Popover.Portal>
      <Popover.Content
        data-testid='popover-content'
        style={{ backgroundColor: 'white', border: '1px solid #888', padding: 8 }}>
        <p>Popover body</p>
        <Popover.Close data-testid='popover-close'>Close</Popover.Close>
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

export const popoverUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Popover',
  ui: <PopoverExample />,
};
