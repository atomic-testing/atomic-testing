import { IExampleUIUnit } from '@atomic-testing/core';
import { NavigationMenu } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix NavigationMenu scene (Wave 3, #1005). Unlike the other Radix overlays,
 * NavigationMenu renders entirely IN-TREE: open content mounts inside
 * `NavigationMenu.Viewport` (a descendant of the root `<nav>`), not a
 * `document.body` portal. One item has a trigger+content pair, one is a plain
 * link, so the driver covers both item shapes.
 */
export const NavigationMenuExample = () => (
  <NavigationMenu.Root data-testid='navigation-menu-root'>
    <NavigationMenu.List data-testid='navigation-menu-list' style={{ display: 'flex', listStyle: 'none', gap: 8 }}>
      <NavigationMenu.Item>
        <NavigationMenu.Trigger data-testid='navigation-menu-learn-trigger'>Learn</NavigationMenu.Trigger>
        <NavigationMenu.Content data-testid='navigation-menu-learn-content'>
          <NavigationMenu.Link data-testid='navigation-menu-link-started' href='https://example.com/start'>
            Getting started
          </NavigationMenu.Link>
          <NavigationMenu.Link data-testid='navigation-menu-link-tutorials' href='https://example.com/tutorials'>
            Tutorials
          </NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item>
        <NavigationMenu.Link data-testid='navigation-menu-docs-link' href='https://example.com/docs'>
          Docs
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
    <NavigationMenu.Viewport data-testid='navigation-menu-viewport' />
  </NavigationMenu.Root>
);

export const navigationMenuUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix NavigationMenu',
  ui: <NavigationMenuExample />,
};
