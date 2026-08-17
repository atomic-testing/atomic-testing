import { Optional } from '@atomic-testing/core';

import { resolveDescribedByRoleText } from '../internal/linkedLocators';
import { AstryxComboboxDriver } from './AstryxComboboxDriver';

/**
 * Driver for the Astryx Selector (`@astryxdesign/core/Selector`) — a single-select
 * combobox.
 *
 * The scene anchors this driver on the root `<div>` (which self-emits
 * `data-testid`). Inside, the `role="combobox"` is on an inner `<button>` that
 * shows the selected option's label (or the placeholder) and links to the popup
 * `role="listbox"` via `aria-controls`; options carry `${listboxId}-item-${i}` ids.
 * Open/selection state is read from `aria-expanded`/`aria-selected` (faithful in
 * jsdom); the popup's true visibility is native-popover behaviour exercised by E2E,
 * so {@link selectByLabel}/{@link getOptionLabels} open the popup first.
 */
export class SelectorDriver extends AstryxComboboxDriver {
  protected override readonly optionIdSeparator = 'item';

  /** The trigger's displayed text — the selected option's label, or the placeholder when nothing is selected. */
  async getSelectedLabel(): Promise<Optional<string>> {
    return (await this.interactor.getText(this.combobox))?.trim() || undefined;
  }

  /** Every option's visible label (opens the popup first). */
  async getOptionLabels(): Promise<readonly string[]> {
    await this.open();
    return this.optionLabels();
  }

  /** Whether the option with the given label is the selected one. Opens the popup first. */
  async isOptionSelected(label: string): Promise<boolean> {
    await this.open();
    return this.isOptionLabelSelected(label);
  }

  /**
   * The `disabledMessage` tooltip text, resolved via the trigger's (the
   * `role="combobox"` control) `aria-describedby` link — Astryx wires
   * `disabledMessage`'s `aria-describedby` onto that inner `<button>`, not the
   * root `<div>`. `undefined` when the selector isn't in that
   * disabled-with-message state.
   */
  async getDisabledMessage(): Promise<Optional<string>> {
    return resolveDescribedByRoleText(this.interactor, this.combobox, 'aria-describedby', 'tooltip');
  }

  /**
   * Select an option by typing on the **closed** trigger, the way a native
   * `<select>` behaves — Astryx 0.4.0 wired Selector to the shared `useTypeahead`,
   * so tabbing to a state picker and pressing "C" lands on "CA".
   *
   * Distinct from {@link selectByLabel}, which opens the popup and clicks: this
   * exercises the closed-trigger path, where the match commits without the popup
   * ever opening and is announced through the live region instead. Repeated
   * presses of the same letter cycle through options sharing it, and spaces count
   * as match characters, so pass the prefix a user would actually type.
   *
   * With `hasSearch` the same keystrokes open the popup and seed its search field
   * instead — that is Astryx's behaviour, not a driver limitation.
   */
  async typeToSelect(prefix: string): Promise<void> {
    await this.interactor.focus(this.combobox);
    for (const character of prefix) {
      await this.interactor.pressKey(this.combobox, character);
    }
  }

  /**
   * Select the option with the given label (opens the popup first).
   * @returns `false` when no such option exists.
   */
  async selectByLabel(label: string): Promise<boolean> {
    await this.open();
    const option = await this.findOptionByLabel(label);
    if (option == null) {
      return false;
    }
    await this.interactor.click(option);
    return true;
  }

  override get driverName(): string {
    return 'AstryxSelectorDriver';
  }
}
