import { IExampleUIUnit } from '@atomic-testing/core';
import { Menubar } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Menubar scene (Wave 3, #1005). The bar itself renders in-tree
 * (`role="menubar"`); each menu's content is portalled to `document.body`.
 * The File menu mixes items with a separator so the item iteration exercises
 * the same interspersed-sibling shape DropdownMenu's does.
 */
export const MenubarExample = () => (
  <Menubar.Root data-testid='menubar-root'>
    <Menubar.Menu>
      <Menubar.Trigger data-testid='menubar-file-trigger'>File</Menubar.Trigger>
      <Menubar.Portal>
        <Menubar.Content
          data-testid='menubar-file-content'
          style={{ backgroundColor: 'white', border: '1px solid #888', padding: 4 }}>
          <Menubar.Item data-testid='menubar-item-new'>New</Menubar.Item>
          <Menubar.Item disabled data-testid='menubar-item-open'>
            Open
          </Menubar.Item>
          <Menubar.Separator style={{ height: 1, backgroundColor: '#ccc' }} />
          <Menubar.Item data-testid='menubar-item-exit'>Exit</Menubar.Item>
        </Menubar.Content>
      </Menubar.Portal>
    </Menubar.Menu>
    <Menubar.Menu>
      <Menubar.Trigger data-testid='menubar-edit-trigger'>Edit</Menubar.Trigger>
      <Menubar.Portal>
        <Menubar.Content
          data-testid='menubar-edit-content'
          style={{ backgroundColor: 'white', border: '1px solid #888', padding: 4 }}>
          <Menubar.Item data-testid='menubar-item-undo'>Undo</Menubar.Item>
          <Menubar.Item data-testid='menubar-item-redo'>Redo</Menubar.Item>
        </Menubar.Content>
      </Menubar.Portal>
    </Menubar.Menu>
  </Menubar.Root>
);

export const menubarUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Menubar',
  ui: <MenubarExample />,
};
