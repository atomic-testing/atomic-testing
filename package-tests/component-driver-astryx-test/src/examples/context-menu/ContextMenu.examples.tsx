import { ContextMenu } from '@astryxdesign/core/ContextMenu';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx ContextMenu scene.
 *
 * A SINGLE instance is rendered on purpose: the driver reads the `role="menu"`
 * items at the document root (the menu is a body-level popover with no id link back
 * to its trigger), so two ContextMenus on one page would be ambiguous — a documented
 * v1 limitation. Items are kept separator-free because dividers are `<div>`s that
 * break the menu's `nth-of-type` item indexing.
 *
 * The scene anchors on the trigger `<div>`, which carries `aria-haspopup="menu"` and
 * the forwarded `data-testid`.
 */
export const ContextMenuExample = () => (
  <ContextMenu
    items={[
      { label: 'Cut', onClick: () => {} },
      { label: 'Copy', onClick: () => {} },
      { label: 'Paste', onClick: () => {} },
    ]}
    data-testid='ctx-menu'>
    <div>Right-click here</div>
  </ContextMenu>
);

export const contextMenuUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ContextMenu',
  ui: <ContextMenuExample />,
};
