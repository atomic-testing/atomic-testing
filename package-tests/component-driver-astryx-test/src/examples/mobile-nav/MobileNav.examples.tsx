import { MobileNav } from '@astryxdesign/core/MobileNav';
import { SideNavItem } from '@astryxdesign/core/SideNav';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx MobileNav scene.
 *
 * MobileNav is an inline native `<dialog class="astryx-mobile-nav">` drawer that
 * forwards `data-testid`, names itself via `aria-label`, records its slide edge in
 * `data-side`, and renders a `<button aria-label="Close navigation">` plus its
 * children. It is rendered CLOSED (`isOpen={false}`): the structure is present and
 * readable in jsdom, but the open transition (`showModal()`) is a no-op there and is
 * exercised only by the E2E run. An explicit `side` makes `data-side` deterministic.
 */
export const MobileNavExample = () => (
  <MobileNav isOpen={false} header='Navigation' label='Mobile navigation' side='start' data-testid='mobile-nav'>
    <SideNavItem label='Home' href='/' />
  </MobileNav>
);

export const mobileNavUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx MobileNav',
  ui: <MobileNavExample />,
};
