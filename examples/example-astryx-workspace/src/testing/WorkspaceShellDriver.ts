import { AppShellDriver, SideNavDriver, SideNavItemDriver } from '@atomic-testing/component-driver-astryx';
import {
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { AppDataTestId } from '../AppDataTestId';
import { WorkspaceShellDataTestId } from '../components/workspaceShell/WorkspaceShellDataTestId';

export type WorkspaceSection = 'chat' | 'admin';

/**
 * Composes the shipped `AppShellDriver` + `SideNavDriver` + per-item `SideNavItemDriver`s
 * into a navigation page object. The AppShell sub-part targets the *same* element this
 * driver is anchored on (`'Same'`), since the shell root carries the testid.
 */
const parts = {
  appShell: { locator: byDataTestId(AppDataTestId.shell, 'Same'), driver: AppShellDriver },
  sideNav: { locator: byDataTestId(WorkspaceShellDataTestId.sideNav), driver: SideNavDriver },
  chatNav: { locator: byDataTestId(WorkspaceShellDataTestId.chatNav), driver: SideNavItemDriver },
  adminNav: { locator: byDataTestId(WorkspaceShellDataTestId.adminNav), driver: SideNavItemDriver },
} satisfies ScenePart;

export class WorkspaceShellDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  /** Click the Chat nav item — navigates to the chat section. */
  async gotoChat(): Promise<void> {
    await this.interactor.click(this.parts.chatNav.locator);
  }

  /** Click the Admin nav item — navigates to the admin settings section. */
  async gotoAdmin(): Promise<void> {
    await this.interactor.click(this.parts.adminNav.locator);
  }

  /** Which section the side nav currently marks as selected. */
  async getCurrentSection(): Promise<WorkspaceSection | undefined> {
    if (await this.parts.adminNav.isSelected()) {
      return 'admin';
    }
    if (await this.parts.chatNav.isSelected()) {
      return 'chat';
    }
    return undefined;
  }

  get appShell(): AppShellDriver {
    return this.parts.appShell;
  }

  get sideNav(): SideNavDriver {
    return this.parts.sideNav;
  }

  get driverName(): string {
    return 'WorkspaceShellDriver';
  }
}
