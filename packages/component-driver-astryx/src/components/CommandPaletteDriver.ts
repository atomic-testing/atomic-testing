import { byCssSelector, byRole, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { iterateIndexedOptions } from '../internal/optionListHelper';

/**
 * Driver for the Astryx CommandPalette (`@astryxdesign/core/CommandPalette`).
 *
 * CommandPalette renders a native `<dialog>` (its open state is controlled by the
 * host, not a trigger) that does **not** forward `data-testid`, so the scene
 * anchors this driver on the dialog itself — e.g. `dialog[aria-label="…"]` from the
 * document root. Inside, the `role="combobox"` `<input>` links to a results
 * `role="listbox"`; each `role="option"` carries `${listboxId}-item-${i}` ids and a
 * `data-value`. Results are debounced/async, so reads wait for them. The dialog's
 * modal behaviour is native, but its structure and the typed-search results render
 * in jsdom (the harness stubs `<dialog>` methods), so search is testable there too.
 */
export class CommandPaletteDriver extends ComponentDriver {
  private get combobox(): PartLocator {
    return locatorUtil.append(this.locator, byRole('combobox'));
  }

  /** Whether the palette is open — the native `<dialog>` carries the `open` attribute. */
  async isOpen(): Promise<boolean> {
    return this.interactor.hasAttribute(this.locator, 'open');
  }

  /** The current query text. */
  async getQuery(): Promise<string> {
    return (await this.interactor.getInputValue(this.combobox)) ?? '';
  }

  /** Type a query into the palette input, triggering a search. */
  async search(text: string): Promise<void> {
    await this.interactor.enterText(this.combobox, text);
  }

  /**
   * Whether a search is in flight. Astryx's busy spinner is the only
   * `[role="status"][aria-label="Loading"]` element; it must be scoped to the
   * dialog root (not the `<input>` combobox, which is a void element with no
   * descendants) and qualified by `aria-label` because every Astryx `Button`
   * also emits a bare `role="status"` span (without `aria-label`).
   */
  async isLoading(): Promise<boolean> {
    return this.interactor.exists(
      locatorUtil.append(this.locator, byCssSelector('[role="status"][aria-label="Loading"]'))
    );
  }

  private async optionIdPrefix(): Promise<Optional<string>> {
    const listboxId = await this.interactor.getAttribute(this.combobox, 'aria-controls');
    return listboxId == null ? undefined : `${listboxId}-item-`;
  }

  private async optionLocators(): Promise<PartLocator[]> {
    const prefix = await this.optionIdPrefix();
    if (prefix == null) {
      return [];
    }
    const locators: PartLocator[] = [];
    for await (const { locator } of iterateIndexedOptions(this.interactor, prefix)) {
      locators.push(locator);
    }
    return locators;
  }

  private async waitForOptions(timeoutMs = 2000): Promise<void> {
    await this.interactor.waitUntil({
      probeFn: async () => (await this.optionLocators()).length,
      terminateCondition: (count: number) => count > 0,
      timeoutMs,
      probeCount: 20,
    });
  }

  private async findOptionByLabel(label: string): Promise<PartLocator | null> {
    for (const locator of await this.optionLocators()) {
      if ((await this.interactor.getText(locator))?.trim() === label) {
        return locator;
      }
    }
    return null;
  }

  /** The result option labels for the current query, waiting for the (debounced) results. */
  async getOptionLabels(): Promise<readonly string[]> {
    await this.waitForOptions();
    const labels: string[] = [];
    for (const locator of await this.optionLocators()) {
      const text = (await this.interactor.getText(locator))?.trim();
      if (text != null && text.length > 0) {
        labels.push(text);
      }
    }
    return labels;
  }

  /** The `data-value` of the result with the given label, or `undefined` when absent. */
  async getOptionValue(label: string): Promise<Optional<string>> {
    await this.waitForOptions();
    const option = await this.findOptionByLabel(label);
    return option == null ? undefined : this.interactor.getAttribute(option, 'data-value');
  }

  /** The `data-value` of the active (highlighted) option, via the input's `aria-activedescendant`. */
  async getActiveValue(): Promise<Optional<string>> {
    const activeId = await this.interactor.getAttribute(this.combobox, 'aria-activedescendant');
    if (activeId == null) {
      return undefined;
    }
    return this.interactor.getAttribute(byCssSelector(`[id="${activeId}"]`, 'Root'), 'data-value');
  }

  /**
   * Select the result with the given label by clicking it (waits for results first).
   * @returns `false` when no such result exists.
   */
  async selectByLabel(label: string): Promise<boolean> {
    await this.waitForOptions();
    const option = await this.findOptionByLabel(label);
    if (option == null) {
      return false;
    }
    await this.interactor.click(option);
    return true;
  }

  /** Close the palette by pressing Escape in the input. */
  async closeByEscape(): Promise<void> {
    await this.interactor.pressKey(this.combobox, 'Escape');
  }

  override get driverName(): string {
    return 'AstryxCommandPaletteDriver';
  }
}
