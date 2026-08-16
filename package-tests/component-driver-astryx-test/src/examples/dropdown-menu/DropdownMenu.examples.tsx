import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSubMenu,
} from '@astryxdesign/core/DropdownMenu';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx DropdownMenu scene (uncontrolled, so clicking the trigger toggles it).
 *
 * The trigger `<button>` forwards `data-testid` and carries
 * `aria-haspopup`/`aria-expanded`/`aria-controls`; the menu panel renders as a
 * sibling linked by `aria-controls`. A visible marker records the last selected
 * item so a selection can be observed without inspecting the (native-popover)
 * panel visibility. Astryx 0.1.3 removed `hasAutoFocus` (it was only an escape
 * hatch for documentation previews) — menus now always focus their first item on
 * open, which is harmless under jsdom.
 *
 * A second menu covers Astryx 0.1.8's selectable menu items —
 * `DropdownMenuCheckboxItem` (`role="menuitemcheckbox"`) and
 * `DropdownMenuRadioGroup`/`DropdownMenuRadioItem` (`role="group"` of
 * `role="menuitemradio"`) — composed as children alongside a plain item, so the
 * mixed-role enumeration (`getItemLabels`/`getItemCount`/`isItemChecked`) is
 * exercised the way a real app would compose them.
 *
 * A third menu covers Astryx 0.2.0's `DropdownMenuSubMenu` alongside 0.4.0's
 * `variant="destructive"`: the submenu's trigger is a `role="menuitem"` row that
 * carries `aria-haspopup="menu"` and is named by its flyout's `aria-labelledby`,
 * which is what lets the submenu's items be read while it is closed.
 */
export const DropdownMenuExample = () => {
  const [last, setLast] = useState('none');
  const [showArchived, setShowArchived] = useState(false);
  const [sort, setSort] = useState('newest');
  return (
    <div>
      <DropdownMenu
        data-testid='dropdown'
        button={{ label: 'Actions' }}
        items={[
          { label: 'Edit', onClick: () => setLast('Edit') },
          { label: 'Duplicate', onClick: () => setLast('Duplicate') },
          { label: 'Delete', onClick: () => setLast('Delete'), isDisabled: true },
        ]}
      />
      <div data-testid='dropdown-last'>{last}</div>

      <DropdownMenu data-testid='dropdown-selectable' button={{ label: 'View' }}>
        <DropdownMenuCheckboxItem label='Show archived' value={showArchived} onChange={setShowArchived} />
        <DropdownMenuRadioGroup value={sort} onChange={setSort} label='Sort by'>
          <DropdownMenuRadioItem value='newest' label='Newest' />
          <DropdownMenuRadioItem value='oldest' label='Oldest' isDisabled />
        </DropdownMenuRadioGroup>
      </DropdownMenu>

      <DropdownMenu data-testid='dropdown-nested' button={{ label: 'Organise' }}>
        <DropdownMenuItem label='Rename' onClick={() => setLast('Rename')} />
        <DropdownMenuSubMenu label='Move to' data-testid='dropdown-submenu'>
          <DropdownMenuItem label='Inbox' onClick={() => setLast('Inbox')} />
          <DropdownMenuItem label='Archive' onClick={() => setLast('Archive')} />
        </DropdownMenuSubMenu>
        <DropdownMenuItem label='Delete' variant='destructive' onClick={() => setLast('Delete')} />
      </DropdownMenu>
    </div>
  );
};

export const dropdownMenuUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx DropdownMenu',
  ui: <DropdownMenuExample />,
};
