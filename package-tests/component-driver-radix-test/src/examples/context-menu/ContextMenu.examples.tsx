import { IExampleUIUnit } from '@atomic-testing/core';
import { ContextMenu } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix ContextMenu audit scene (Wave 0 capability-gap audit; no driver yet).
 * The content is portalled; the trigger has explicit size so a right-click has
 * geometry to land on.
 */
export const ContextMenuExample = () => (
  <ContextMenu.Root>
    <ContextMenu.Trigger
      data-testid='context-menu-trigger'
      style={{ display: 'block', width: 200, height: 80, border: '1px dashed #888' }}>
      Right-click here
    </ContextMenu.Trigger>
    <ContextMenu.Portal>
      <ContextMenu.Content
        data-testid='context-menu-content'
        style={{ backgroundColor: 'white', border: '1px solid #888', padding: 4 }}>
        <ContextMenu.Item data-testid='context-menu-item-copy'>Copy</ContextMenu.Item>
        <ContextMenu.Item disabled data-testid='context-menu-item-paste'>
          Paste
        </ContextMenu.Item>
        <ContextMenu.Separator style={{ height: 1, backgroundColor: '#ccc' }} />
        <ContextMenu.Item data-testid='context-menu-item-delete'>Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Portal>
  </ContextMenu.Root>
);

export const contextMenuUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix ContextMenu',
  ui: <ContextMenuExample />,
};
