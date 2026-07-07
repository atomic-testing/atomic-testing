import { MoreMenu } from '@astryxdesign/core/MoreMenu';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx MoreMenu scene (uncontrolled) — an icon-only "⋯" overflow menu over
 * DropdownMenu. The trigger has no visible text; its accessible name is the
 * default `aria-label` ("More options"). A visible marker records the last
 * selected item. Astryx 0.1.3 removed `hasAutoFocus` (it was only an escape
 * hatch for documentation previews) — menus now always focus their first item on
 * open, which is harmless under jsdom.
 */
export const MoreMenuExample = () => {
  const [last, setLast] = useState('none');
  return (
    <div>
      <MoreMenu
        data-testid='more-menu'
        items={[
          { label: 'Rename', onClick: () => setLast('Rename') },
          { label: 'Archive', onClick: () => setLast('Archive') },
          { label: 'Delete', onClick: () => setLast('Delete'), isDisabled: true },
        ]}
      />
      <div data-testid='more-menu-last'>{last}</div>
    </div>
  );
};

export const moreMenuUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx MoreMenu',
  ui: <MoreMenuExample />,
};
