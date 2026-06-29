import { byCssSelector, locatorUtil, Optional } from '@atomic-testing/core';

import { AstryxComboboxDriver } from './AstryxComboboxDriver';

/** Default accessible label of the optional "select all" option (Astryx `selectAllLabel`). */
const DEFAULT_SELECT_ALL_LABEL = 'Select all';

/**
 * Driver for the Astryx MultiSelector (`@astryxdesign/core/MultiSelector`) — a
 * multi-select combobox.
 *
 * Like {@link AstryxComboboxDriver}, the `role="combobox"` trigger links to the
 * popup `role="listbox"` (`aria-multiselectable="true"`), whose options carry
 * `${listboxId}-item-${i}` ids and an inner `<input type="checkbox">`. Each option's
 * checked state is mirrored by `aria-selected` on the option, so the selected set is
 * read from `aria-selected="true"` — which naturally excludes the optional
 * "select all" row (it reports `aria-selected="false"` and an `aria-checked="mixed"`
 * checkbox). The trigger shows a count ("N selected") rather than the labels.
 */
export class MultiSelectorDriver extends AstryxComboboxDriver {
  protected override readonly optionIdSeparator = 'item';

  /** The trigger's displayed text (e.g. "2 selected" or the placeholder). */
  async getTriggerText(): Promise<Optional<string>> {
    return (await this.interactor.getText(this.combobox))?.trim() || undefined;
  }

  /** Every option's visible label, including a "select all" row when present (opens the popup first). */
  async getOptionLabels(): Promise<readonly string[]> {
    await this.open();
    return this.optionLabels();
  }

  /**
   * The labels of the currently selected options (`aria-selected="true"`), excluding
   * the "select all" row. Opens the popup.
   *
   * Astryx sets `aria-selected="true"` on the select-all row too once every option is
   * selected (it mirrors the option's `isSelected`), so filtering on `aria-selected`
   * alone would wrongly include it. The select-all row carries no DOM marker beyond
   * its label, so it is excluded by label — pass {@link selectAllLabel} when it was
   * customised via Astryx's `selectAllLabel`.
   */
  async getSelectedLabels(selectAllLabel: string = DEFAULT_SELECT_ALL_LABEL): Promise<readonly string[]> {
    await this.open();
    const selected: string[] = [];
    for (const locator of await this.optionLocators()) {
      if ((await this.interactor.getAttribute(locator, 'aria-selected')) === 'true') {
        const text = (await this.interactor.getText(locator))?.trim();
        if (text != null && text.length > 0 && text !== selectAllLabel) {
          selected.push(text);
        }
      }
    }
    return selected;
  }

  /** The number of selected options, excluding the "select all" row. Opens the popup. */
  async getSelectedCount(selectAllLabel: string = DEFAULT_SELECT_ALL_LABEL): Promise<number> {
    return (await this.getSelectedLabels(selectAllLabel)).length;
  }

  /** Whether the option with the given label is selected. Opens the popup. */
  async isOptionSelected(label: string): Promise<boolean> {
    await this.open();
    return this.isOptionLabelSelected(label);
  }

  /**
   * Toggle the option with the given label (opens the popup first).
   * @returns `false` when no such option exists.
   */
  async toggleByLabel(label: string): Promise<boolean> {
    await this.open();
    const option = await this.findOptionByLabel(label);
    if (option == null) {
      return false;
    }
    await this.interactor.click(option);
    return true;
  }

  /**
   * Click the "select all" option (opens the popup first).
   * @param label The select-all row's label, when customised via `selectAllLabel`.
   * @returns `false` when there is no such row (the MultiSelector lacks `hasSelectAll`).
   */
  async selectAll(label: string = DEFAULT_SELECT_ALL_LABEL): Promise<boolean> {
    return this.toggleByLabel(label);
  }

  /**
   * Clear the whole selection via the trigger's clear control.
   * @returns `false` when there is no clear control (the MultiSelector lacks `hasClear`).
   */
  async clearAll(): Promise<boolean> {
    // Astryx labels the clear control `Clear all ${label}`, so match by prefix.
    const clear = locatorUtil.append(this.locator, byCssSelector('button[aria-label^="Clear all"]'));
    if (!(await this.interactor.exists(clear))) {
      return false;
    }
    await this.interactor.click(clear);
    return true;
  }

  override get driverName(): string {
    return 'AstryxMultiSelectorDriver';
  }
}
