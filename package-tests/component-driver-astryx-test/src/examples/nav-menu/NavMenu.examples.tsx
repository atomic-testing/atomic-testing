import { NavHeadingMenu, NavHeadingMenuItem } from '@astryxdesign/core/NavMenu';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx NavMenu scene.
 *
 * `NavHeadingMenu` renders an inline `<div role="menu">` that forwards
 * `data-testid`; each `NavHeadingMenuItem` is a `role="menuitem"` (`<a>` with an
 * `href`, else `<div>`). A second menu renders alongside so tests can prove the
 * driver only sees its own items. The `Settings` item updates a visible marker so
 * a click can be observed without relying on navigation.
 */
export const NavMenuExample = () => {
  const [picked, setPicked] = useState('none');
  return (
    <div>
      <NavHeadingMenu data-testid='nav-menu' size='lg'>
        <NavHeadingMenuItem label='Dashboard' href='/dashboard' />
        <NavHeadingMenuItem label='Analytics' href='/analytics' />
        <NavHeadingMenuItem label='Settings' onClick={() => setPicked('Settings')} />
        <NavHeadingMenuItem label='Archived' href='/archived' isDisabled />
      </NavHeadingMenu>
      <NavHeadingMenu data-testid='nav-menu-secondary' size='md'>
        <NavHeadingMenuItem label='Other A' href='/a' />
        <NavHeadingMenuItem label='Other B' href='/b' />
      </NavHeadingMenu>
      <div data-testid='nav-picked'>{picked}</div>
    </div>
  );
};

export const navMenuUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx NavMenu',
  ui: <NavMenuExample />,
};
