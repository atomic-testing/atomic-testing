import { ButtonDriver, CommandPaletteDriver } from '@atomic-testing/component-driver-astryx';
import {
  byCssSelector,
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { COMMAND_PALETTE_LABEL, CommandBarDataTestId } from '../components/commandBar/CommandBarDataTestId';

/**
 * Wraps the shipped `CommandPaletteDriver` with its ⌘K trigger button. The palette
 * renders a native `<dialog aria-label="…">` that forwards no testid, so it is anchored
 * by that accessible label (matching the shipped CommandPalette suite).
 */
const parts = {
  trigger: { locator: byDataTestId(CommandBarDataTestId.trigger), driver: ButtonDriver },
  palette: {
    locator: byCssSelector(`dialog[aria-label="${COMMAND_PALETTE_LABEL}"]`),
    driver: CommandPaletteDriver,
  },
} satisfies ScenePart;

export class CommandBarDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  async isOpen(): Promise<boolean> {
    return this.parts.palette.isOpen();
  }

  /** Open the palette via its trigger (no-op if already open). */
  async open(): Promise<void> {
    if (await this.parts.palette.isOpen()) {
      return;
    }
    await this.parts.trigger.click();
  }

  /** The available command labels. */
  async getCommands(): Promise<readonly string[]> {
    await this.open();
    return this.parts.palette.getOptionLabels();
  }

  /** Open the palette and run the command with the given label. */
  async run(label: string): Promise<boolean> {
    await this.open();
    if (await this.parts.palette.selectByLabel(label)) {
      return true;
    }
    // Fall back to searching first, in case the source does not bootstrap every item.
    await this.parts.palette.search(label);
    return this.parts.palette.selectByLabel(label);
  }

  async close(): Promise<void> {
    await this.parts.palette.closeByEscape();
  }

  get driverName(): string {
    return 'CommandBarDriver';
  }
}
