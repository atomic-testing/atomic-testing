import { byCssSelector, locatorUtil, Optional } from '@atomic-testing/core';

import { IndexedOptionListDriver } from '../internal/IndexedOptionListDriver';

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
 *
 * The option-enumeration surface (locate/label/select/wait) comes from
 * {@link IndexedOptionListDriver}; this driver adds only the palette-specific open
 * state, query, loading, and active-descendant reads.
 */
export class CommandPaletteDriver extends IndexedOptionListDriver {
  protected override readonly optionIdSeparator = 'item';

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

  /** The result option labels for the current query, waiting for the (debounced) results. */
  async getOptionLabels(): Promise<readonly string[]> {
    await this.waitForOptions();
    return this.optionLabels();
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
