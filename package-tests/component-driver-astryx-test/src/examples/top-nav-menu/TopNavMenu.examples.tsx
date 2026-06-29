import { TopNav, TopNavItem, TopNavMenu } from '@astryxdesign/core/TopNav';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx TopNavMenu scene.
 *
 * TopNavMenu renders a trigger `<button class="astryx-top-nav-menu">` plus an inline
 * (always-mounted) panel of `role="menuitem"` entries. The trigger does NOT forward
 * `data-testid`, so the scene anchors on the semantic class. The panel markup is
 * present while closed, so item titles are readable in jsdom; the open transition is
 * native-popover-driven and only exercised by the E2E run.
 *
 * The two items mix shapes on purpose: Analytics has an `href` (renders `<a
 * role="menuitem">`) while Messaging has only an `onClick` (renders `<div
 * role="menuitem">`). That heterogeneity is exactly what a tag-based `nth-of-type`
 * walk mis-indexes; the driver enumerates by `:nth-child` so both titles read in
 * order.
 */
export const TopNavMenuExample = () => (
  <TopNav
    label='Main navigation'
    startContent={[
      <TopNavItem key='home' label='Home' href='/' />,
      <TopNavMenu
        key='products'
        label='Products'
        items={[
          { title: 'Analytics', description: 'Track user behavior', href: '/products/analytics' },
          { title: 'Messaging', description: 'Real-time communication', onClick: () => {} },
        ]}
      />,
    ]}
  />
);

export const topNavMenuUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx TopNavMenu',
  ui: <TopNavMenuExample />,
};
