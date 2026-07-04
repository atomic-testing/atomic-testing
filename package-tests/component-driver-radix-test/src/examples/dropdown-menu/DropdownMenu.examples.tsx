import { IExampleUIUnit } from '@atomic-testing/core';
import { DropdownMenu } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix DropdownMenu audit scene (Wave 0 portal-recipe audit; no driver yet).
 * The content is portalled to `document.body`.
 */
export const DropdownMenuExample = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger data-testid='dropdown-menu-trigger'>Options</DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        data-testid='dropdown-menu-content'
        style={{ backgroundColor: 'white', border: '1px solid #888', padding: 4 }}>
        <DropdownMenu.Item data-testid='dropdown-menu-item-profile'>Profile</DropdownMenu.Item>
        <DropdownMenu.Item disabled data-testid='dropdown-menu-item-billing'>
          Billing
        </DropdownMenu.Item>
        <DropdownMenu.Separator style={{ height: 1, backgroundColor: '#ccc' }} />
        <DropdownMenu.Item data-testid='dropdown-menu-item-logout'>Log out</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export const dropdownMenuUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix DropdownMenu',
  ui: <DropdownMenuExample />,
};
