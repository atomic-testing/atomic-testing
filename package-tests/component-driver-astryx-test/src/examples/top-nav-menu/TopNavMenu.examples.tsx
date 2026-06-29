import { TopNav, TopNavItem, TopNavMenu } from '@astryxdesign/core/TopNav';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx TopNavMenu scene.
 *
 * TopNavMenu renders a trigger `<button class="astryx-top-nav-menu">` plus an inline
 * (always-mounted) panel of `role="menuitem"` anchors. The trigger does NOT forward
 * `data-testid`, so the scene anchors on the semantic class. The panel markup is
 * present while closed, so item titles are readable in jsdom; the open transition is
 * native-popover-driven and only exercised by the E2E run.
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
          { title: 'Messaging', description: 'Real-time communication', href: '/products/messaging' },
        ]}
      />,
    ]}
  />
);

export const topNavMenuUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx TopNavMenu',
  ui: <TopNavMenuExample />,
};
