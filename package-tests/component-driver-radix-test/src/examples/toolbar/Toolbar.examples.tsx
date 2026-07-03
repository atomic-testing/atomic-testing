import { IExampleUIUnit } from '@atomic-testing/core';
import { Toolbar } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Toolbar scene (Wave 3, #1005). Fully in-tree (`role="toolbar"`), with
 * every Toolbar part shape: a toggle group, a separator, a link, and a button —
 * so item enumeration must skip the separator, the same interspersed-sibling
 * shape the menu drivers handle.
 */
export const ToolbarExample = () => (
  <Toolbar.Root data-testid='toolbar-root' aria-label='Formatting options'>
    <Toolbar.ToggleGroup type='multiple' aria-label='Text formatting' data-testid='toolbar-toggle-group'>
      <Toolbar.ToggleItem value='bold' data-testid='toolbar-toggle-bold'>
        Bold
      </Toolbar.ToggleItem>
      <Toolbar.ToggleItem value='italic' data-testid='toolbar-toggle-italic'>
        Italic
      </Toolbar.ToggleItem>
    </Toolbar.ToggleGroup>
    <Toolbar.Separator data-testid='toolbar-separator' style={{ width: 1, backgroundColor: '#ccc' }} />
    <Toolbar.Link data-testid='toolbar-link' href='https://example.com/history'>
      Edited 2 hours ago
    </Toolbar.Link>
    <Toolbar.Button data-testid='toolbar-share'>Share</Toolbar.Button>
  </Toolbar.Root>
);

export const toolbarUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Toolbar',
  ui: <ToolbarExample />,
};
