import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { IToggleDriver } from '@atomic-testing/core';

/**
 * Driver for a single Fluent v9 `ToolbarRadioButton` (a child of
 * `ToolbarRadioGroup` — see {@link ToolbarRadioGroupDriver}).
 *
 * DOM audit (@fluentui/react-components@9.8.3): renders a real
 * `<button role="radio" aria-checked="true|false">` — built on the same
 * toggle-button primitive as `ToggleButtonDriver`, but `useToolbarRadioButton`
 * explicitly deletes the `aria-pressed` it would otherwise carry and sets
 * `role="radio"`/`aria-checked` instead, so selection reads `aria-checked`
 * (not `aria-pressed`) and — unlike a real native radio input — clicking the
 * already-selected button is simply a no-op click, never a `setSelected(false)`
 * rejection path (there is no native radio semantics here to reject against).
 */
export class ToolbarRadioButtonDriver extends HTMLButtonDriver implements IToggleDriver {
  /** Whether this button is the selected one in its group (`aria-checked="true"`). */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-checked')) === 'true';
  }

  /** Select this button by clicking it. `setSelected(false)` is rejected — a radio button cannot deselect itself. */
  async setSelected(selected: boolean): Promise<void> {
    if (!selected) {
      throw new Error('A ToolbarRadioButton cannot be deselected directly; select a different item instead.');
    }
    if (await this.isSelected()) {
      return;
    }
    if (await this.isDisabled()) {
      return;
    }
    await this.interactor.click(this.locator);
  }

  override get driverName(): string {
    return 'FluentV9ToolbarRadioButtonDriver';
  }
}
