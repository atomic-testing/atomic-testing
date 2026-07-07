import { DropdownMenu } from '@astryxdesign/core/DropdownMenu';
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
 */
export const DropdownMenuExample = () => {
  const [last, setLast] = useState('none');
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
    </div>
  );
};

export const dropdownMenuUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx DropdownMenu',
  ui: <DropdownMenuExample />,
};
