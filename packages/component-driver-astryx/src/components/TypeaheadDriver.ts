import { byCssSelector, locatorUtil, PartLocator } from '@atomic-testing/core';

import { AstryxComboboxDriver } from './AstryxComboboxDriver';

/**
 * Driver for the Astryx Typeahead (`@astryxdesign/core/Typeahead`) — a
 * search-as-you-type single-select combobox.
 *
 * The scene anchors this driver on the root `<div>` (which self-emits
 * `data-testid`); the `role="combobox"` is on the `<input>`, linked by
 * `aria-controls` to the results `role="listbox"` (`aria-label="Search results"`)
 * whose options carry `${listboxId}-option-${i}` ids. Results are produced by the
 * (debounced, possibly async) `searchSource`, so reads wait for them via
 * {@link AstryxComboboxDriver.waitForOptions}; the result panel renders in jsdom
 * once React resolves the search, so query/results/selection are testable there as
 * well as in the browser.
 */
export class TypeaheadDriver extends AstryxComboboxDriver {
  protected override readonly optionIdSeparator = 'option';

  /** The current query text in the input. */
  async getQuery(): Promise<string> {
    return (await this.interactor.getInputValue(this.combobox)) ?? '';
  }

  /** Type a query into the input (replacing any existing text), triggering a search. */
  async type(text: string): Promise<void> {
    await this.interactor.enterText(this.combobox, text);
  }

  /**
   * Whether a search is in flight. The busy spinner is the only
   * `[role="status"][aria-label="Loading"]` element; a bare `role="status"`
   * match would also catch the clear button's always-present status span (every
   * Astryx `Button` emits one without an `aria-label`), giving a false positive
   * whenever a value is selected.
   */
  async isLoading(): Promise<boolean> {
    return this.interactor.exists(
      locatorUtil.append(this.locator, byCssSelector('[role="status"][aria-label="Loading"]'))
    );
  }

  /** The result option labels for the current query, waiting for the (debounced) results to arrive. */
  async getResultLabels(): Promise<readonly string[]> {
    await this.waitForOptions();
    return this.optionLabels();
  }

  /**
   * Select the result with the given label, waiting for results first.
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

  /** The clear control, present when `hasClear` and a value is set. */
  private get clearButton(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('button[aria-label^="Clear"]'));
  }

  /**
   * Clear the current selection/query via the clear control.
   * @returns `false` when there is no clear control.
   */
  async clear(): Promise<boolean> {
    if (!(await this.interactor.exists(this.clearButton))) {
      return false;
    }
    await this.interactor.click(this.clearButton);
    return true;
  }

  override get driverName(): string {
    return 'AstryxTypeaheadDriver';
  }
}
