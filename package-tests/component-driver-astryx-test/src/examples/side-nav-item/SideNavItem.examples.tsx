import { SideNav, SideNavItem, SideNavSection } from '@astryxdesign/core/SideNav';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx SideNavItem scene.
 *
 * A SideNavItem renders one of two shapes: a leaf is an
 * `<a class="astryx-side-nav-item">` (the root is the anchor), while a
 * collapsible-with-children item is a `<div>` wrapping an `<a href>` and a
 * `<button aria-expanded>` toggle. Rendering a selected leaf and a collapsible item
 * (each with its own `data-testid`, inside their SideNav host) lets the driver verify
 * selection, href, label, and expansion across both shapes.
 */
export const SideNavItemExample = () => (
  <SideNav data-testid='side-nav'>
    <SideNavSection title='Main'>
      <SideNavItem label='Dashboard' href='/dashboard' isSelected data-testid='sni-leaf' />
      <SideNavItem label='Settings' href='/settings' collapsible data-testid='sni-collapsible'>
        <SideNavItem label='Profile' href='/settings/profile' />
      </SideNavItem>
    </SideNavSection>
  </SideNav>
);

export const sideNavItemUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx SideNavItem',
  ui: <SideNavItemExample />,
};
