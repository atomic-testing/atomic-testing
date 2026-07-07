import { byAriaLabel, byCssSelector, escapeUtil, locatorUtil, Optional } from '@atomic-testing/core';

import { IndexedOptionListDriver } from '../internal/IndexedOptionListDriver';
import { resolveDescribedByRoleText } from '../internal/linkedLocators';

/** A filter chip is `<span class="astryx-token">`; the class is a stable semantic hook, not StyleX-hashed. */
const TOKEN_SELECTOR = 'span.astryx-token';

/**
 * Driver for the Astryx PowerSearch (`@astryxdesign/core/PowerSearch`) — the
 * wave's hardest component (best-effort v1).
 *
 * PowerSearch reuses the Tokenizer shell: a `role="group"` root (self-emitting
 * `data-testid`) holding filter chips (`span.astryx-token`), a `role="combobox"`
 * query `<input>` whose results list field/operator suggestions
 * (`${listboxId}-option-${i}` ids, shared with Typeahead — hence the
 * {@link IndexedOptionListDriver} base), and a trailing "N results" count. Each chip
 * exposes a field/operator edit `<button>`, the value text, and a
 * `Remove <field: operator>` button — so chips are addressed by their
 * field/operator label.
 *
 * **Scoped v1 / blocking dependency:** the per-operator *edit popover* opened by
 * {@link editFilter} has no stable role/testid/open-state anchor in
 * `@astryxdesign/core@0.1.1`, so reading or completing an in-popover edit is left to
 * E2E/follow-up and is not modelled here; this driver covers chip enumeration,
 * removal, clear, the query/field-suggestion search, and the result count. Building
 * a brand-new filter is multi-step (field → operator → value) and likewise
 * best-effort. See #913 / the umbrella's PowerSearch row.
 */
export class PowerSearchDriver extends IndexedOptionListDriver {
  protected override readonly optionIdSeparator = 'option';

  /**
   * Each chip's field/operator label, read from its `Remove <field: operator>`
   * button. Astryx wraps each chip in its own `<span>`, so the remove buttons —
   * read in one multi-attribute pass — are the portable enumeration anchor (every
   * chip has exactly one, present whether or not the chip is wrapped).
   */
  async getFilterLabels(): Promise<readonly string[]> {
    const removes = locatorUtil.append(this.locator, byCssSelector('button[aria-label^="Remove "]'));
    const labels = await this.interactor.getAttribute(removes, 'aria-label', true);
    return labels.map(label => label.replace(/^Remove /, ''));
  }

  /** Number of filter chips. */
  async getFilterCount(): Promise<number> {
    return (await this.getFilterLabels()).length;
  }

  /** The current query text in the input. */
  async getQuery(): Promise<string> {
    return (await this.interactor.getInputValue(this.combobox)) ?? '';
  }

  /**
   * The `disabledMessage` tooltip text. PowerSearch is a thin wrapper that
   * forwards `isDisabled`/`disabledMessage` straight through to an internal
   * Tokenizer, which wires `aria-describedby` onto its `role="combobox"` query
   * input — not the `role="group"` root. `undefined` when the field isn't in
   * that disabled-with-message state.
   */
  async getDisabledMessage(): Promise<Optional<string>> {
    return resolveDescribedByRoleText(this.interactor, this.combobox, 'aria-describedby', 'tooltip');
  }

  /** Type into the query input to search field/operator suggestions. */
  async type(text: string): Promise<void> {
    await this.interactor.enterText(this.combobox, text);
  }

  /** The field/operator suggestion labels for the current query, waiting for the (debounced) results. */
  async getFieldSuggestionLabels(): Promise<readonly string[]> {
    await this.waitForOptions();
    return this.optionLabels();
  }

  /**
   * Open the edit popover for the chip with the given field/operator label by
   * clicking its edit button. Reading/completing the popover edit is E2E/follow-up
   * (the popover has no stable anchor in v1 — see the class doc).
   * @returns `false` when no such chip exists.
   */
  async editFilter(label: string): Promise<boolean> {
    // Target the edit button (the one without a `Remove …` aria-label) of the chip
    // whose remove button matches. The label is escaped for use inside the `:has()`
    // attribute string (it is field/operator text and may contain quotes); `:has()`
    // is supported by jsdom's nwsapi and all three Playwright engines.
    const editButton = locatorUtil.append(
      this.locator,
      byCssSelector(
        `${TOKEN_SELECTOR}:has(> button[aria-label="Remove ${escapeUtil.escapeValue(label)}"]) > button:not([aria-label])`
      )
    );
    if (!(await this.interactor.exists(editButton))) {
      return false;
    }
    await this.interactor.click(editButton);
    return true;
  }

  /**
   * Remove the chip with the given field/operator label via its "Remove" button.
   * `byAriaLabel` escapes the label, so field/operator names containing quotes are
   * matched safely.
   * @returns `false` when no such chip exists.
   */
  async removeFilter(label: string): Promise<boolean> {
    const remove = locatorUtil.append(this.locator, byAriaLabel(`Remove ${label}`));
    if (!(await this.interactor.exists(remove))) {
      return false;
    }
    await this.interactor.click(remove);
    return true;
  }

  /**
   * Remove every filter chip. Chips are removed individually (each via its own
   * "Remove" button) rather than through the shared "Clear all" control, which under
   * controlled `filters` state only drops one chip per click.
   * @returns `false` when there were no chips to clear.
   */
  async clearAll(): Promise<boolean> {
    const labels = await this.getFilterLabels();
    if (labels.length === 0) {
      return false;
    }
    for (const label of labels) {
      await this.removeFilter(label);
    }
    return true;
  }

  /**
   * The trailing result-count text, e.g. "42 results", or `undefined` when absent.
   *
   * Astryx 0.1.1 renders the count as the combobox's `endContent` with no
   * role/testid/data hook (only StyleX-hashed classes, which this package does not
   * couple to), so it is read from the root's trailing region positionally. The
   * read is guarded on a digit so a markup shift that moves a non-count element into
   * that slot yields `undefined` rather than unrelated text.
   */
  async getResultText(): Promise<Optional<string>> {
    const result = locatorUtil.append(this.locator, byCssSelector('> div:last-child'));
    if (!(await this.interactor.exists(result))) {
      return undefined;
    }
    const text = (await this.interactor.getText(result))?.trim();
    return text != null && text.length > 0 && /\d/.test(text) ? text : undefined;
  }

  /** The numeric result count parsed from {@link getResultText}, or `undefined` when not a number. */
  async getResultCount(): Promise<Optional<number>> {
    const text = await this.getResultText();
    const match = text?.match(/\d[\d,]*/);
    return match == null ? undefined : Number(match[0].replace(/,/g, ''));
  }

  override get driverName(): string {
    return 'AstryxPowerSearchDriver';
  }
}
