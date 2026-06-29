import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx DateRangeInput (`@astryxdesign/core/DateRangeInput`).
 *
 * This is the wave's hardest input: its value lives almost entirely behind a
 * native-popover dialog. The scene anchors on the root `<div>` (self-emitting
 * `data-testid`); the trigger is a `<button aria-haspopup="dialog">` whose text is
 * the display string and which links — only while open — to the popover via
 * `aria-controls`. The popover `[role="dialog"]` holds a `[role="listbox"]` of
 * preset `[role="option"]` buttons and a range Calendar of `[data-date]` cells.
 *
 * The popover renders in jsdom once React opens it (reachable via `aria-controls`),
 * so open/preset/range-pick are exercised in jsdom and the browser alike; its true
 * top-layer visibility is native-popover behaviour, so the interaction tests are
 * gated off WebKit (see `webkitGate`). The Calendar opens on the current month —
 * pick dates within the visible range or navigate first.
 */
export class DateRangeInputDriver extends ComponentDriver {
  private get trigger(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('button[aria-haspopup="dialog"]'));
  }

  /** The trigger's display text — the formatted range, or the placeholder when unset. */
  async getDisplayText(): Promise<Optional<string>> {
    return (await this.interactor.getText(this.trigger))?.trim() || undefined;
  }

  /** Whether the popover is open — read from the trigger's `aria-expanded`. */
  async isExpanded(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.trigger, 'aria-expanded')) === 'true';
  }

  /** Open the popover by clicking the trigger, if not already open. */
  async open(): Promise<void> {
    if (!(await this.isExpanded())) {
      await this.interactor.click(this.trigger);
    }
  }

  /** Close the popover by clicking the trigger, if open. */
  async close(): Promise<void> {
    if (await this.isExpanded()) {
      await this.interactor.click(this.trigger);
    }
  }

  /** The open popover's id (the trigger's `aria-controls`), or `undefined` when closed. */
  private async popoverId(): Promise<Optional<string>> {
    return (await this.interactor.getAttribute(this.trigger, 'aria-controls')) ?? undefined;
  }

  private presetAt(popoverId: string, position: number): PartLocator {
    return byCssSelector(
      `[id="${popoverId}"] [aria-label="Preset date ranges"] > button:nth-child(${position})`,
      'Root'
    );
  }

  /** The preset labels offered in the popover (opens it first). */
  async getPresetLabels(): Promise<readonly string[]> {
    await this.open();
    const popoverId = await this.popoverId();
    if (popoverId == null) {
      return [];
    }
    const labels: string[] = [];
    for (let k = 1; await this.interactor.exists(this.presetAt(popoverId, k)); k++) {
      const text = (await this.interactor.getText(this.presetAt(popoverId, k)))?.trim();
      if (text != null && text.length > 0) {
        labels.push(text);
      }
    }
    return labels;
  }

  /** The label of the active preset (`aria-selected="true"`), or `undefined` when none is. Opens the popover. */
  async getSelectedPreset(): Promise<Optional<string>> {
    await this.open();
    const popoverId = await this.popoverId();
    if (popoverId == null) {
      return undefined;
    }
    for (let k = 1; await this.interactor.exists(this.presetAt(popoverId, k)); k++) {
      const option = this.presetAt(popoverId, k);
      if ((await this.interactor.getAttribute(option, 'aria-selected')) === 'true') {
        return (await this.interactor.getText(option))?.trim();
      }
    }
    return undefined;
  }

  /**
   * Open the popover and click the preset with the given label.
   * @returns `false` when no such preset exists.
   */
  async selectPreset(label: string): Promise<boolean> {
    await this.open();
    const popoverId = await this.popoverId();
    if (popoverId == null) {
      return false;
    }
    for (let k = 1; await this.interactor.exists(this.presetAt(popoverId, k)); k++) {
      const option = this.presetAt(popoverId, k);
      if ((await this.interactor.getText(option))?.trim() === label) {
        await this.interactor.click(option);
        return true;
      }
    }
    return false;
  }

  /**
   * Open the popover and pick a range by clicking the start then the end day. Both
   * dates must be visible in the current month view (navigate first otherwise).
   * @returns `false` when either day is not currently rendered.
   */
  async pickRange(startIsoDate: string, endIsoDate: string): Promise<boolean> {
    await this.open();
    const popoverId = await this.popoverId();
    if (popoverId == null) {
      return false;
    }
    const start = byCssSelector(`[id="${popoverId}"] [data-date="${startIsoDate}"]`, 'Root');
    const end = byCssSelector(`[id="${popoverId}"] [data-date="${endIsoDate}"]`, 'Root');
    if (!(await this.interactor.exists(start)) || !(await this.interactor.exists(end))) {
      return false;
    }
    await this.interactor.click(start);
    await this.interactor.click(end);
    return true;
  }

  /**
   * Clear the selected range via the clear control.
   * @returns `false` when there is no clear control (`hasClear` is off or nothing is selected).
   */
  async clear(): Promise<boolean> {
    const clear = locatorUtil.append(this.locator, byCssSelector('button[aria-label^="Clear"]'));
    if (!(await this.interactor.exists(clear))) {
      return false;
    }
    await this.interactor.click(clear);
    return true;
  }

  override get driverName(): string {
    return 'AstryxDateRangeInputDriver';
  }
}
