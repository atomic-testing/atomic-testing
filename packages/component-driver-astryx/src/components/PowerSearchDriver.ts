import { byCssSelector, byRole, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { iterateIndexedOptions } from '../internal/optionListHelper';

/** A filter chip is `<span class="astryx-token">`; the class is a stable semantic hook, not StyleX-hashed. */
const TOKEN_SELECTOR = 'span.astryx-token';

/**
 * Driver for the Astryx PowerSearch (`@astryxdesign/core/PowerSearch`) — the
 * wave's hardest component (best-effort v1).
 *
 * PowerSearch reuses the Tokenizer shell: a `role="group"` root (self-emitting
 * `data-testid`) holding filter chips (`span.astryx-token`), a `role="combobox"`
 * query `<input>` whose results list field/operator suggestions
 * (`${listboxId}-option-${i}` ids, shared with Typeahead), and a trailing
 * "N results" count. Each chip exposes a field/operator edit `<button>`, the value
 * text, and a `Remove <field: operator>` button — so chips are addressed by their
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
export class PowerSearchDriver extends ComponentDriver {
  private get combobox(): PartLocator {
    return locatorUtil.append(this.locator, byRole('combobox'));
  }

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

  /** Type into the query input to search field/operator suggestions. */
  async type(text: string): Promise<void> {
    await this.interactor.enterText(this.combobox, text);
  }

  /** Locators for the current field/operator suggestion options, or `[]` when the input is closed. */
  private async suggestionLocators(): Promise<PartLocator[]> {
    const listboxId = await this.interactor.getAttribute(this.combobox, 'aria-controls');
    if (listboxId == null) {
      return [];
    }
    const locators: PartLocator[] = [];
    for await (const { locator } of iterateIndexedOptions(this.interactor, `${listboxId}-option-`)) {
      locators.push(locator);
    }
    return locators;
  }

  /** The field/operator suggestion labels for the current query, waiting for the (debounced) results. */
  async getFieldSuggestionLabels(): Promise<readonly string[]> {
    await this.interactor.waitUntil({
      probeFn: async () => (await this.suggestionLocators()).length,
      terminateCondition: (count: number) => count > 0,
      timeoutMs: 2000,
      probeCount: 20,
    });
    const labels: string[] = [];
    for (const locator of await this.suggestionLocators()) {
      const text = (await this.interactor.getText(locator))?.trim();
      if (text != null && text.length > 0) {
        labels.push(text);
      }
    }
    return labels;
  }

  /**
   * Open the edit popover for the chip with the given field/operator label by
   * clicking its edit button. Reading/completing the popover edit is E2E/follow-up
   * (the popover has no stable anchor in v1 — see the class doc).
   * @returns `false` when no such chip exists.
   */
  async editFilter(label: string): Promise<boolean> {
    // Target the edit button (the one without a `Remove …` aria-label) of the chip
    // whose remove button matches — `:has()` is supported by jsdom's nwsapi and all
    // three Playwright engines.
    const editButton = locatorUtil.append(
      this.locator,
      byCssSelector(`${TOKEN_SELECTOR}:has(> button[aria-label="Remove ${label}"]) > button:not([aria-label])`)
    );
    if (!(await this.interactor.exists(editButton))) {
      return false;
    }
    await this.interactor.click(editButton);
    return true;
  }

  /**
   * Remove the chip with the given field/operator label via its "Remove" button.
   * @returns `false` when no such chip exists.
   */
  async removeFilter(label: string): Promise<boolean> {
    const remove = locatorUtil.append(this.locator, byCssSelector(`button[aria-label="Remove ${label}"]`));
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

  /** The trailing result-count text, e.g. "42 results", or `undefined` when absent. */
  async getResultText(): Promise<Optional<string>> {
    const result = locatorUtil.append(this.locator, byCssSelector('> div:last-child'));
    if (!(await this.interactor.exists(result))) {
      return undefined;
    }
    return (await this.interactor.getText(result))?.trim() || undefined;
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
