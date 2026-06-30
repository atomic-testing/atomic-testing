import { TopNav, TopNavHeading, TopNavItem } from '@astryxdesign/core/TopNav';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx TopNav scene.
 *
 * TopNav is a `<nav>` landmark whose `startContent` holds `TopNavItem` links
 * (`<a class="astryx-top-nav-item">`). Rendering selected / normal / disabled items
 * lets the driver exercise item-count and per-item ARIA state. `startContent` is
 * used (not `children`) because Astryx drops the `children` alias when both are set.
 */
export const TopNavExample = () => (
  <TopNav
    label='Main navigation'
    heading={<TopNavHeading heading='My App' headingHref='/' />}
    startContent={[
      <TopNavItem key='home' label='Home' href='/' isSelected />,
      <TopNavItem key='products' label='Products' href='/products' />,
      <TopNavItem key='disabled' label='Disabled' href='/x' isDisabled />,
    ]}
    data-testid='top-nav'
  />
);

export const topNavUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx TopNav',
  ui: <TopNavExample />,
};
