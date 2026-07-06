import {
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { AppDataTestId } from '../AppDataTestId';
import { AdminSettingsDriver } from './AdminSettingsDriver';
import { ChatPanelDriver } from './ChatPanelDriver';
import { CommandBarDriver } from './CommandBarDriver';
import { WorkspaceSection, WorkspaceShellDriver } from './WorkspaceShellDriver';

/**
 * The top-level page object: the shell + chat + admin + command bar composed into one,
 * so an entire flow reads through a single object — `workspace.gotoAdmin()`,
 * `workspace.chat.send('…')`, `workspace.commandBar.run('Open settings')`. This driver
 * (and {@link workspaceParts}) is imported verbatim by both the Vitest DOM specs and the
 * Playwright E2E specs; only the engine construction differs.
 */
const parts = {
  shell: { locator: byDataTestId(AppDataTestId.shell), driver: WorkspaceShellDriver },
  chat: { locator: byDataTestId(AppDataTestId.chatSection), driver: ChatPanelDriver },
  admin: { locator: byDataTestId(AppDataTestId.adminSection), driver: AdminSettingsDriver },
  commandBar: { locator: byDataTestId(AppDataTestId.commandBar), driver: CommandBarDriver },
} satisfies ScenePart;

export class WorkspaceDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  async gotoChat(): Promise<void> {
    await this.parts.shell.gotoChat();
  }

  async gotoAdmin(): Promise<void> {
    await this.parts.shell.gotoAdmin();
  }

  async getCurrentSection(): Promise<WorkspaceSection | undefined> {
    return this.parts.shell.getCurrentSection();
  }

  get shell(): WorkspaceShellDriver {
    return this.parts.shell;
  }

  get chat(): ChatPanelDriver {
    return this.parts.chat;
  }

  get admin(): AdminSettingsDriver {
    return this.parts.admin;
  }

  get commandBar(): CommandBarDriver {
    return this.parts.commandBar;
  }

  get driverName(): string {
    return 'WorkspaceDriver';
  }
}
