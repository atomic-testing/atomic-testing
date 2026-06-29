import { TopNav, TopNavItem, TopNavMegaMenu, TopNavMegaMenuItem } from '@astryxdesign/core/TopNav';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx TopNavMegaMenu scene.
 *
 * TopNavMegaMenu renders a trigger `<button class="astryx-top-nav-mega-menu">` plus
 * an inline full-width panel of `<a class="astryx-top-nav-mega-menu-item">` entries.
 * The trigger forwards no `data-testid` (scene anchors on the semantic class) and
 * carries `aria-haspopup="true"` (not `"dialog"`). Entry markup is always mounted,
 * so titles read in jsdom; the open transition is native-Popover-API-driven and only
 * exercised by the E2E run.
 */
export const TopNavMegaMenuExample = () => (
  <TopNav
    label='Main navigation'
    startContent={[
      <TopNavItem key='home' label='Home' href='/' />,
      <TopNavMegaMenu
        key='products'
        label='Products'
        items={
          <>
            <TopNavMegaMenuItem title='Analytics' description='Track behavior' href='/analytics' />
            <TopNavMegaMenuItem title='Messaging' description='Real-time comms' href='/messaging' />
          </>
        }
      />,
    ]}
  />
);

export const topNavMegaMenuUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx TopNavMegaMenu',
  ui: <TopNavMegaMenuExample />,
};
