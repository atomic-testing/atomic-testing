import { SnackbarDriver, TabsDriver } from '@atomic-testing/component-driver-mui-v9';
import {
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { AppDataTestId } from '../../AppDataTestId';
import { FilterBarDataTestId } from '../filterBar/FilterBarDataTestId';
import { FilterBarDriver } from '../filterBar/FilterBarDriver';
import { TeamNavDataTestId } from '../teamNav/TeamNavDataTestId';
import { TeamNavDriver } from '../teamNav/TeamNavDriver';
import { TicketEditorDataTestId } from '../ticketEditor/TicketEditorDataTestId';
import { TicketEditorDriver } from '../ticketEditor/TicketEditorDriver';
import { TicketGridDataTestId } from '../ticketGrid/TicketGridDataTestId';
import { TicketGridDriver } from '../ticketGrid/TicketGridDriver';

const parts = {
  teamNav: { locator: byDataTestId(TeamNavDataTestId.root), driver: TeamNavDriver },
  filterBar: { locator: byDataTestId(FilterBarDataTestId.root), driver: FilterBarDriver },
  grid: { locator: byDataTestId(TicketGridDataTestId.root), driver: TicketGridDriver },
  tabs: { locator: byDataTestId(AppDataTestId.tabs), driver: TabsDriver },
  // The editor dialog and save toast portal to <body>, so they are addressed from the document Root.
  editor: { locator: byDataTestId(TicketEditorDataTestId.root, 'Root'), driver: TicketEditorDriver },
  toast: { locator: byDataTestId(AppDataTestId.toast, 'Root'), driver: SnackbarDriver },
} satisfies ScenePart;

// The top-level page object: one object a test reads end-to-end through. It composes the four
// feature page objects plus the view tabs and the save toast, so a scenario reads like a person
// triaging tickets.
export class TicketConsoleDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  get teamNav(): TeamNavDriver {
    return this.parts.teamNav;
  }

  get filterBar(): FilterBarDriver {
    return this.parts.filterBar;
  }

  get grid(): TicketGridDriver {
    return this.parts.grid;
  }

  get tabs(): TabsDriver {
    return this.parts.tabs;
  }

  get editor(): TicketEditorDriver {
    return this.parts.editor;
  }

  get toast(): SnackbarDriver {
    return this.parts.toast;
  }

  /** Wait for the grid to finish its first render before a scenario starts reading rows. */
  async waitUntilReady(timeoutMs: number = 10000): Promise<void> {
    await this.grid.waitForLoad(timeoutMs);
  }

  override get driverName(): string {
    return 'TicketConsoleDriver';
  }
}
