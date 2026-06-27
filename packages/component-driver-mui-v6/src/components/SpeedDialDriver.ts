import { byCssSelector, ComponentDriver, escapeUtil, locatorUtil, PartLocator } from '@atomic-testing/core';

// The trigger FAB carries the open state via aria-expanded; the action buttons
// carry their name via aria-label. Both are distinct MUI classes within the root.
const fabLocator = byCssSelector('.MuiSpeedDial-fab');
const actionLocator = byCssSelector('.MuiSpeedDialAction-fab');

/**
 * Driver for the Material UI v7 SpeedDial component.
 *
 * SpeedDial renders a trigger FAB (`.MuiSpeedDial-fab`, `aria-expanded` reflects
 * open state) and a set of action FABs (`.MuiSpeedDialAction-fab`, each
 * aria-labelled with its name). The actions stay mounted but are only revealed
 * when open, so open state is read from the FAB's `aria-expanded` rather than
 * action presence.
 * @see https://mui.com/material-ui/react-speed-dial/
 */
export class SpeedDialDriver extends ComponentDriver {
  private get fab(): PartLocator {
    return locatorUtil.append(this.locator, fabLocator);
  }

  /**
   * Whether the speed dial is open (its FAB reports `aria-expanded="true"`).
   */
  async isOpen(): Promise<boolean> {
    const expanded = await this.interactor.getAttribute(this.fab, 'aria-expanded');
    return expanded === 'true';
  }

  /**
   * Open the speed dial by hovering its FAB. No-op when already open.
   *
   * Hover (`onMouseEnter`) is the trigger that opens consistently across MUI
   * versions and browsers — clicking only focuses-then-opens in Chromium, and
   * focus opens in v7 but not v5, whereas hover opens everywhere.
   */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.interactor.hover(this.fab);
    }
  }

  /**
   * Close the speed dial by moving the pointer off its FAB. No-op when already closed.
   */
  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.interactor.mouseLeave(this.fab);
    }
  }

  /**
   * The labels of every action, in order (read from each action FAB's aria-label).
   */
  async getActionLabels(): Promise<string[]> {
    const labels = await this.interactor.getAttribute(
      locatorUtil.append(this.locator, actionLocator),
      'aria-label',
      true
    );
    return labels.filter((label): label is string => label != null);
  }

  /**
   * Trigger the action with the given label, opening the dial first if needed.
   * @returns `false` when no action has that label.
   */
  async triggerActionByLabel(label: string): Promise<boolean> {
    await this.open();
    const actionByLabel = byCssSelector(`.MuiSpeedDialAction-fab[aria-label="${escapeUtil.escapeValue(label)}"]`);
    const locator = locatorUtil.append(this.locator, actionByLabel);
    if (!(await this.interactor.exists(locator))) {
      return false;
    }
    await this.interactor.click(locator);
    return true;
  }

  override get driverName(): string {
    return 'MuiV6SpeedDialDriver';
  }
}
