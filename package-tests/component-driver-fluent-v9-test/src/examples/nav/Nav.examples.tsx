import { IExampleUIUnit } from '@atomic-testing/core';
import {
  Button,
  FluentProvider,
  Nav,
  NavCategory,
  NavCategoryItem,
  NavDrawer,
  NavDrawerBody,
  NavItem,
  NavSubItem,
  NavSubItemGroup,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX, useState } from 'react';

/**
 * Two plain `Nav`s (deliberately different item counts so a too-broadly-scoped
 * locator in `NavDriver` would be caught immediately, same disambiguation
 * shape as the `Tags`/`Menu` examples) plus one `NavDrawer` (portal-backed —
 * see `NavDrawerDriver`'s class doc). `NavDrawer`'s `defaultOpen` is, like
 * `OverlayDrawer`'s, non-functional, so it is driven as a controlled
 * component (`open`/`onOpenChange`), same recipe as the `Drawer` example.
 * Every `href`-bearing item `preventDefault`s its click — a real anchor
 * click would otherwise navigate the E2E browser away from the app.
 */
const preventNavigation = (event: React.MouseEvent) => event.preventDefault();

const NavExample = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <FluentProvider theme={webLightTheme}>
      <Nav data-testid='nav-a' defaultSelectedValue='home' defaultOpenCategories={['reports']}>
        <NavItem value='home' href='/home' onClick={preventNavigation}>
          Home
        </NavItem>
        <NavCategory value='reports'>
          <NavCategoryItem>Reports</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value='reports-daily' href='/reports/daily' onClick={preventNavigation}>
              Daily
            </NavSubItem>
            <NavSubItem value='reports-weekly' href='/reports/weekly' onClick={preventNavigation}>
              Weekly
            </NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
        <NavItem value='settings' href='/settings' onClick={preventNavigation}>
          Settings
        </NavItem>
      </Nav>

      <Nav data-testid='nav-b' defaultSelectedValue='alpha'>
        <NavItem value='alpha' href='/alpha' onClick={preventNavigation}>
          Alpha
        </NavItem>
        <NavItem value='beta' href='/beta' onClick={preventNavigation}>
          Beta
        </NavItem>
      </Nav>

      <Button data-testid='nav-drawer-trigger' onClick={() => setDrawerOpen(true)}>
        Open nav drawer
      </Button>
      <NavDrawer
        data-testid='nav-drawer'
        open={drawerOpen}
        onOpenChange={(_event, data) => setDrawerOpen(data.open)}
        defaultSelectedValue='drawer-home'>
        <NavDrawerBody>
          <NavItem value='drawer-home' href='/drawer/home' onClick={preventNavigation}>
            Drawer Home
          </NavItem>
          <NavItem value='drawer-profile' href='/drawer/profile' onClick={preventNavigation}>
            Drawer Profile
          </NavItem>
        </NavDrawerBody>
      </NavDrawer>
    </FluentProvider>
  );
};

export const navUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Nav',
  ui: <NavExample />,
};
