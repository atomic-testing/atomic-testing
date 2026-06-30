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
 *
 * A standalone top-level `SideNavItem` ("Home") is placed BEFORE the sections on
 * purpose: it renders a roleless `<div>` sibling of the `<div role="group">`
 * sections, so it is exactly the case a tag-based `nth-of-type` walk mis-indexes
 * (`[role="group"]:nth-of-type(1)` would require the first `<div>` to be a group).
 * The driver counts by `:nth-child` + a `role="group"` filter, so `getSectionCount`
 * is still `2`.
 */
export const SideNavExample = () => (
  <SideNav data-testid='side-nav' header={<SideNavHeading heading='My App' headingHref='/' />} collapsible>
    <SideNavItem label='Home' href='/' />
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
