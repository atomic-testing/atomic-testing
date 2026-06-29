import { AppShell } from '@astryxdesign/core/AppShell';
import { SideNav, SideNavItem } from '@astryxdesign/core/SideNav';
import { TopNav, TopNavHeading } from '@astryxdesign/core/TopNav';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx AppShell scene.
 *
 * AppShell is a slot-based layout orchestrator: it places `topNav`, `sideNav`, and
 * `children` into landmark regions. The driver confirms the regions are mounted and
 * reads the `data-variant` (default `'elevated'`) and the `role="main"` text, then
 * hands off to the child navigation drivers. The scene anchors on the root via the
 * forwarded `data-testid`.
 */
export const AppShellExample = () => (
  <AppShell
    topNav={<TopNav label='Main' heading={<TopNavHeading heading='My App' />} />}
    sideNav={
      <SideNav>
        <SideNavItem label='Home' href='/' />
      </SideNav>
    }
    data-testid='app-shell'>
    <div>Main content here</div>
  </AppShell>
);

export const appShellUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx AppShell',
  ui: <AppShellExample />,
};
