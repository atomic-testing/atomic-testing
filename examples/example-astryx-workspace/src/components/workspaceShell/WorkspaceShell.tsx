import { AppShell } from '@astryxdesign/core/AppShell';
import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@astryxdesign/core/SideNav';
import { TopNav, TopNavHeading } from '@astryxdesign/core/TopNav';
import { MouseEvent } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { AppDataTestId } from '../../AppDataTestId';
import { CommandBar } from '../commandBar/CommandBar';
import { WorkspaceShellDataTestId } from './WorkspaceShellDataTestId';

/**
 * The Astryx AppShell chrome: a top nav (app heading + ⌘K command bar), a side nav
 * switching between the two co-equal sections (Chat / Admin), and the routed section
 * in the main region. Nav items keep their `href` for accessibility but navigate via
 * the router so both jsdom and the browser stay single-page.
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
      topNav={
        <TopNav label='Workspace' heading={<TopNavHeading heading='Astryx Workspace' />} endContent={<CommandBar />} />
      }
      sideNav={
        <SideNav
          data-testid={WorkspaceShellDataTestId.sideNav}
          header={<SideNavHeading heading='Astryx Workspace' headingHref='/' />}
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
