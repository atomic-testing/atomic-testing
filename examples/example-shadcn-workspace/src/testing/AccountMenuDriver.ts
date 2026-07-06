import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { DropdownMenuDriver } from '@atomic-testing/component-driver-shadcn-v1';
import {
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { WorkspaceHeaderDataTestId as T } from '../components/workspaceHeader/WorkspaceHeaderDataTestId';

/**
 * The header composed into one page object: the "Account" trigger, the
 * portalled `DropdownMenuContent` (the shipped `DropdownMenuDriver` re-roots
 * itself at `role="menu"` on `document.body` — the scene's `data-testid`
 * compounds onto that same element), and the visible status line the items
 * update. Tests read `choose('Sign out')` instead of choreographing the portal.
 */
const parts = {
  trigger: { locator: byDataTestId(T.accountTrigger), driver: HTMLButtonDriver },
  menu: { locator: byDataTestId(T.accountMenu), driver: DropdownMenuDriver },
  status: { locator: byDataTestId(T.accountStatus), driver: HTMLElementDriver },
} satisfies ScenePart;

export class AccountMenuDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  async isOpen(): Promise<boolean> {
    return this.parts.menu.isOpen();
  }

  /** Open the menu by clicking the trigger, if not already open. */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.parts.trigger.click();
    }
  }

  /** Open the menu (if needed) and click the item with the given visible label. */
  async choose(label: string): Promise<void> {
    await this.open();
    await this.parts.menu.selectByLabel(label);
    // In a real browser the closing menu stays mounted for shadcn's ~100ms
    // animate-out, and mounted-content existence IS the driver's open signal —
    // so wait for the unmount instead of sampling isOpen mid-animation. (jsdom
    // runs no animations; there the probe terminates on its first pass.)
    await this.interactor.waitUntil({
      probeFn: () => this.parts.menu.isOpen(),
      terminateCondition: false,
      timeoutMs: 1000,
    });
  }

  /** The number of `role="menuitem"` entries — separators are skipped by the driver. */
  async getMenuItemCount(): Promise<number> {
    await this.open();
    return this.parts.menu.getMenuItemCount();
  }

  /** The visible session-status line ("Signed in as …" / "Signed out"). */
  async getStatus(): Promise<string | null> {
    return (await this.parts.status.getText())?.trim() ?? null;
  }

  get menu(): DropdownMenuDriver {
    return this.parts.menu;
  }

  get driverName(): string {
    return 'AccountMenuDriver';
  }
}
