import { AppShell } from '@astryxdesign/core/AppShell';
import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/HStack';
import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@astryxdesign/core/SideNav';
import { Tooltip } from '@astryxdesign/core/Tooltip';
import { TopNav, TopNavHeading } from '@astryxdesign/core/TopNav';
import { MouseEvent } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { AppDataTestId } from '../../AppDataTestId';
import { CommandBar } from '../commandBar/CommandBar';
import { WorkspaceShellDataTestId } from './WorkspaceShellDataTestId';

const APP_NAME = 'Astryx Workspace';

const DEMO_DISCLAIMER =
  'This is a demo — there is no real backend. Replies, saves, and deletes are simulated client-side and reset on reload.';

/**
 * The Astryx AppShell chrome: a top nav (a route-derived section label + a subtle "Demo"
 * disclaimer + the ⌘K command bar), a side nav switching between the two co-equal sections
 * (Chat / Admin), and the routed section in the main region. The product name lives once
 * (the SideNav heading); the top nav shows the *current section* so the two never repeat.
 * Nav items keep their `href` for accessibility but navigate via the router so both jsdom
 * and the browser stay single-page.
 */
export function WorkspaceShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  const go = (to: string) => (e: MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <AppShell
      data-testid={AppDataTestId.shell}
      contentPadding={4}
      topNav={
        <TopNav
          label='Workspace'
          heading={<TopNavHeading heading={isAdmin ? 'Admin' : 'Chat'} />}
          endContent={
            <HStack gap={2} align='center'>
              <Tooltip content={DEMO_DISCLAIMER} placement='below'>
                <Button variant='ghost' size='sm' label='Demo' />
              </Tooltip>
              <CommandBar />
            </HStack>
          }
        />
      }
      sideNav={
        <SideNav
          data-testid={WorkspaceShellDataTestId.sideNav}
          header={<SideNavHeading heading={APP_NAME} headingHref='/' />}
          collapsible>
          <SideNavSection title='Workspace'>
            <SideNavItem
              data-testid={WorkspaceShellDataTestId.chatNav}
              label='Chat'
              href='/'
              isSelected={!isAdmin}
              onClick={go('/')}
            />
            <SideNavItem
              data-testid={WorkspaceShellDataTestId.adminNav}
              label='Admin'
              href='/admin'
              isSelected={isAdmin}
              onClick={go('/admin')}
            />
          </SideNavSection>
          <SideNavSection title='Chats'>
            <SideNavItem label='Trip planning' href='/' onClick={go('/')} />
            <SideNavItem label='Code review' href='/' onClick={go('/')} />
          </SideNavSection>
        </SideNav>
      }>
      <Outlet />
    </AppShell>
  );
}
