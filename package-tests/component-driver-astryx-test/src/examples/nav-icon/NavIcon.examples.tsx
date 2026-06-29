import { NavIcon } from '@astryxdesign/core/NavIcon';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx NavIcon scene.
 *
 * NavIcon is a display-only `<span class="astryx-navicon">` (with `data-testid`
 * forwarded) wrapping the supplied `icon` node. The scene renders a single
 * instance with a star glyph so the driver can read its markup.
 */
export const NavIconExample = () => (
  <div>
    <NavIcon icon={<span>★</span>} data-testid='navicon-basic' />
  </div>
);

export const navIconUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx NavIcon',
  ui: <NavIconExample />,
};
