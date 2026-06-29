import { byRole, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { iterateIndexedOptions } from './optionListHelper';

/**
 * Shared base for every Astryx driver that reads a `role="combobox"`-linked
 * `role="listbox"` whose options carry contiguous `${listboxId}-${separator}-${i}`
 * ids (see `optionListHelper`): the combobox family ({@link AstryxComboboxDriver}
 * and its Selector/MultiSelector/Typeahead/Tokenizer subclasses), the
 * CommandPalette (a host-controlled `<dialog>`), and PowerSearch's field/operator
 * suggestions.
 *
 * It owns only the *option enumeration* surface — locating, labelling, selecting,
 * and waiting for options — deliberately leaving open/close lifecycle to the
 * subclasses, because that differs across members (a trigger you click and
 * `aria-expanded` for the combobox family; a host-controlled dialog for
 * CommandPalette; an always-mounted query input for PowerSearch). Subclasses
 * supply the option id separator (`'item'` for the click-to-open selectors and the
 * command palette, `'option'` for the type-to-search typeaheads and PowerSearch).
 */
export abstract class IndexedOptionListDriver extends ComponentDriver {
  /** The id-segment between the listbox id and the option index (`'item'` or `'option'`). */
  protected abstract readonly optionIdSeparator: string;

  /** The `role="combobox"` control — a `<button>` for the selectors, an `<input>` for the typeaheads/palette. */
  protected get combobox(): PartLocator {
    return locatorUtil.append(this.locator, byRole('combobox'));
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
   * result lists of the type-to-search members (Typeahead, Tokenizer, PowerSearch,
   * CommandPalette). Resolves early once options appear; otherwise returns after the
   * timeout (e.g. a query with no results), leaving the caller to read an empty list.
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
