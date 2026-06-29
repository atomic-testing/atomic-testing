import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@astryxdesign/core/SideNav';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx SideNav scene.
 *
 * SideNav is a `<nav aria-label="Side navigation">` (the label is hardcoded — there
 * is no `label` prop) that forwards `data-testid` onto its root. Its `children`
 * render as `[role="group"]` sections, and `collapsible` adds a footer
 * `<button aria-label="Collapse …">`. Two sections plus a collapsible toggle let the
 * driver verify the section count and collapse-button presence.
 */
export const SideNavExample = () => (
  <SideNav data-testid='side-nav' header={<SideNavHeading heading='My App' headingHref='/' />} collapsible>
    <SideNavSection title='Main'>
      <SideNavItem label='Dashboard' href='/dashboard' isSelected />
      <SideNavItem label='Reports' href='/reports' />
    </SideNavSection>
    <SideNavSection title='Settings'>
      <SideNavItem label='Profile' href='/profile' />
    </SideNavSection>
  </SideNav>
);

export const sideNavUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx SideNav',
  ui: <SideNavExample />,
};
