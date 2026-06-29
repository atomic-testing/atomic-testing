import { IndexedOptionListDriver } from '../internal/IndexedOptionListDriver';

/**
 * Shared base for the Astryx combobox family (Selector, MultiSelector, Typeahead,
 * Tokenizer).
 *
 * Every member renders a `role="combobox"` control carrying `aria-expanded` and
 * `aria-controls` → the popup `role="listbox"`, whose `role="option"` children have
 * contiguous `${listboxId}-${separator}-${i}` ids. The popup is rendered with the
 * native Popover API, so its *visibility* is E2E-only; the panel and its options are
 * still mounted in jsdom once React opens it (the `aria-expanded`/`aria-selected`
 * reads are faithful). The option-enumeration surface lives in
 * {@link IndexedOptionListDriver}; this layer adds the trigger-based open/close
 * lifecycle. Subclasses supply the option id separator (`'item'` for the
 * click-to-open selectors, `'option'` for the type-to-search typeaheads) and their
 * own selection semantics.
 */
export abstract class AstryxComboboxDriver extends IndexedOptionListDriver {
  /** Whether the popup is open — read from the combobox's `aria-expanded`. */
  async isExpanded(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.combobox, 'aria-expanded')) === 'true';
  }

  /**
   * Open the popup by clicking the combobox, if not already open, then wait for
   * `aria-expanded` to flip. The wait matters in the browser: `click()` resolves
   * once the event dispatches, but the listbox and its options mount on React's
   * subsequent render, so a read that races ahead would see an empty popup.
   */
  async open(): Promise<void> {
    if (!(await this.isExpanded())) {
      await this.interactor.click(this.combobox);
      await this.waitForExpanded();
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

  /** Wait until the combobox reports `aria-expanded="true"` (the popup has mounted). */
  private async waitForExpanded(): Promise<void> {
    await this.interactor.waitUntil({
      probeFn: () => this.isExpanded(),
      terminateCondition: (open: boolean) => open,
      timeoutMs: 2000,
      probeCount: 20,
    });
  }
}
