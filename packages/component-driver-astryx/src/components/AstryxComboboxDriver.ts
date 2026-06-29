import { byRole, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { iterateIndexedOptions } from '../internal/optionListHelper';

/**
 * Shared base for the Astryx combobox family (Selector, MultiSelector, Typeahead,
 * Tokenizer).
 *
 * Every member renders a `role="combobox"` control carrying `aria-expanded` and
 * `aria-controls` → the popup `role="listbox"`, whose `role="option"` children have
 * contiguous `${listboxId}-${separator}-${i}` ids (see `optionListHelper`). The
 * popup is rendered with the native Popover API, so its *visibility* is E2E-only;
 * the panel and its options are still mounted in jsdom once React opens it (the
 * `aria-expanded`/`aria-selected` reads are faithful). Subclasses supply the option
 * id separator (`'item'` for the click-to-open selectors, `'option'` for the
 * type-to-search typeaheads) and their own open/selection semantics.
 */
export abstract class AstryxComboboxDriver extends ComponentDriver {
  /** The id-segment between the listbox id and the option index (`'item'` or `'option'`). */
  protected abstract readonly optionIdSeparator: string;

  /** The `role="combobox"` control — a `<button>` for the selectors, an `<input>` for the typeaheads. */
  protected get combobox(): PartLocator {
    return locatorUtil.append(this.locator, byRole('combobox'));
  }

  /** Whether the popup is open — read from the combobox's `aria-expanded`. */
  async isExpanded(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.combobox, 'aria-expanded')) === 'true';
  }

  /** Open the popup by clicking the combobox, if not already open. */
  async open(): Promise<void> {
    if (!(await this.isExpanded())) {
      await this.interactor.click(this.combobox);
    }
  }

  /**
   * Close the popup, if open, by pressing Escape on the combobox. (Re-clicking the
   * trigger is unreliable once the popup's top layer overlaps it — Firefox cannot
   * land the click — whereas Astryx closes the listbox on Escape.)
   */
  async close(): Promise<void> {
    if (await this.isExpanded()) {
      await this.interactor.pressKey(this.combobox, 'Escape');
    }
  }

  /** The `${listboxId}-${separator}-` id prefix shared by the open popup's options, or `undefined` when closed. */
  protected async optionIdPrefix(): Promise<Optional<string>> {
    const listboxId = await this.interactor.getAttribute(this.combobox, 'aria-controls');
    return listboxId == null ? undefined : `${listboxId}-${this.optionIdSeparator}-`;
  }

  /** Every option locator in the open popup, in DOM order. Empty when closed. */
  protected async optionLocators(): Promise<PartLocator[]> {
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

  /** The option locator whose visible text matches `label`, or `null` when absent. */
  protected async findOptionByLabel(label: string): Promise<PartLocator | null> {
    for (const locator of await this.optionLocators()) {
      if ((await this.interactor.getText(locator))?.trim() === label) {
        return locator;
      }
    }
    return null;
  }

  /** The visible labels of the options currently in the open popup, in DOM order. */
  protected async optionLabels(): Promise<readonly string[]> {
    const labels: string[] = [];
    for (const locator of await this.optionLocators()) {
      const text = (await this.interactor.getText(locator))?.trim();
      if (text != null && text.length > 0) {
        labels.push(text);
      }
    }
    return labels;
  }

  /** Whether the option with the given label is selected (`aria-selected="true"`). `false` when absent. */
  protected async isOptionLabelSelected(label: string): Promise<boolean> {
    const locator = await this.findOptionByLabel(label);
    return locator != null && (await this.interactor.getAttribute(locator, 'aria-selected')) === 'true';
  }

  /**
   * Wait until the open popup has at least one option, for the debounced/async
   * result lists of the type-to-search members (Typeahead, Tokenizer). Resolves
   * early once options appear; otherwise returns after the timeout (e.g. a query
   * with no results), leaving the caller to read an empty list.
   */
  protected async waitForOptions(timeoutMs = 2000): Promise<void> {
    await this.interactor.waitUntil({
      probeFn: async () => (await this.optionLocators()).length,
      terminateCondition: (count: number) => count > 0,
      timeoutMs,
      probeCount: 20,
    });
  }
}
