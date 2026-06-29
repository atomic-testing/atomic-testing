import { TopNav, TopNavItem } from '@astryxdesign/core/TopNav';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx TopNavItem scene.
 *
 * Each TopNavItem renders an `<a class="astryx-top-nav-item">` and forwards
 * `data-testid` onto it. Rendering a selected, a normal, and a disabled item (all
 * inside a TopNav, their natural host) lets the driver verify `aria-current`,
 * `aria-disabled`, label, and href reads against distinct instances.
 */
export const TopNavItemExample = () => (
  <TopNav
    label='Main navigation'
    startContent={[
      <TopNavItem key='selected' label='Home' href='/' isSelected data-testid='tni-selected' />,
      <TopNavItem key='normal' label='Products' href='/products' data-testid='tni-normal' />,
      <TopNavItem key='disabled' label='Settings' href='/settings' isDisabled data-testid='tni-disabled' />,
    ]}
  />
);

export const topNavItemUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx TopNavItem',
  ui: <TopNavItemExample />,
};
