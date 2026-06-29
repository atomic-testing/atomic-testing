import { byCssSelector, locatorUtil, PartLocator } from '@atomic-testing/core';

import { AstryxComboboxDriver } from './AstryxComboboxDriver';

/** Astryx renders each chip as `<span class="astryx-token">`; the class is a stable semantic hook, not StyleX-hashed. */
const TOKEN_SELECTOR = 'span.astryx-token';

/**
 * Driver for the Astryx Tokenizer (`@astryxdesign/core/Tokenizer`) — a
 * search-as-you-type multi-token input.
 *
 * The root is a `role="group"` (self-emitting `data-testid`) holding the existing
 * token chips followed by the `role="combobox"` `<input>`; results render in a
 * popup `role="listbox"` whose options carry `${listboxId}-option-${i}` ids (shared
 * with Typeahead). Tokens are the root's `span.astryx-token` children, each with a
 * `Remove <label>` button. With `hasCreate`, a non-matching query yields a
 * `Create "<query>"` option. Results are debounced/async, so reads wait via
 * {@link AstryxComboboxDriver.waitForOptions}.
 */
export class TokenizerDriver extends AstryxComboboxDriver {
  protected override readonly optionIdSeparator = 'option';

  private tokenAt(position: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`> ${TOKEN_SELECTOR}:nth-child(${position})`));
  }

  /** Every token chip's label, in DOM order. */
  async getTokenLabels(): Promise<readonly string[]> {
    const labels: string[] = [];
    for (let position = 1; await this.interactor.exists(this.childAt(position)); position++) {
      const token = this.tokenAt(position);
      if (await this.interactor.exists(token)) {
        const text = (await this.interactor.getText(token))?.trim();
        if (text != null && text.length > 0) {
          labels.push(text);
        }
      }
    }
    return labels;
  }

  private childAt(position: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`> *:nth-child(${position})`));
  }

  /** Number of token chips. */
  async getTokenCount(): Promise<number> {
    return (await this.getTokenLabels()).length;
  }

  /** The current query text in the input. */
  async getQuery(): Promise<string> {
    return (await this.interactor.getInputValue(this.combobox)) ?? '';
  }

  /** Type a query into the input, triggering a search. */
  async type(text: string): Promise<void> {
    await this.interactor.enterText(this.combobox, text);
  }

  /**
   * Whether a search is in flight. Qualified by `aria-label="Loading"` so it
   * matches only the busy spinner and not the clear button's always-present bare
   * `role="status"` span (every Astryx `Button` emits one without an
   * `aria-label`), which would otherwise be a false positive once a token exists.
   */
  async isLoading(): Promise<boolean> {
    return this.interactor.exists(
      locatorUtil.append(this.locator, byCssSelector('[role="status"][aria-label="Loading"]'))
    );
  }

  /** The result option labels for the current query, waiting for the (debounced) results. */
  async getResultLabels(): Promise<readonly string[]> {
    await this.waitForOptions();
    return this.optionLabels();
  }

  /**
   * Add the result with the given label as a token (waits for results first).
   * @returns `false` when no such result exists.
   */
  async addByLabel(label: string): Promise<boolean> {
    await this.waitForOptions();
    const option = await this.findOptionByLabel(label);
    if (option == null) {
      return false;
    }
    await this.interactor.click(option);
    return true;
  }

  /**
   * Click the `Create "<query>"` option to add the current query as a new token
   * (requires `hasCreate`; waits for results first).
   * @returns `false` when there is no create option.
   */
  async create(): Promise<boolean> {
    await this.waitForOptions();
    for (const locator of await this.optionLocators()) {
      if ((await this.interactor.getText(locator))?.trim().startsWith('Create "')) {
        await this.interactor.click(locator);
        return true;
      }
    }
    return false;
  }

  /**
   * Remove the token with the given label via its "Remove" button.
   * @returns `false` when no such token exists.
   */
  async removeToken(label: string): Promise<boolean> {
    const remove = locatorUtil.append(this.locator, byCssSelector(`button[aria-label="Remove ${label}"]`));
    if (!(await this.interactor.exists(remove))) {
      return false;
    }
    await this.interactor.click(remove);
    return true;
  }

  /**
   * Clear every token via the clear control.
   * @returns `false` when there is no clear control (`hasClear` is off or there are no tokens).
   */
  async clearAll(): Promise<boolean> {
    const clear = locatorUtil.append(this.locator, byCssSelector('button[aria-label^="Clear"]'));
    if (!(await this.interactor.exists(clear))) {
      return false;
    }
    await this.interactor.click(clear);
    return true;
  }

  override get driverName(): string {
    return 'AstryxTokenizerDriver';
  }
}
