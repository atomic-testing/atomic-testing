import {
  byAttribute,
  byRole,
  ComponentDriver,
  IInputDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

/**
 * Driver for the Astryx SegmentedControl (`@astryxdesign/core/SegmentedControl`).
 *
 * SegmentedControl is single-select with radio-group semantics: the root carries
 * `role="radiogroup"` + the accessible name (`aria-label`), and each segment is a
 * `<button role="radio" aria-checked data-value tabindex>` — the segment identity
 * lives in the stable `data-value`, never the visible label or a StyleX class.
 * SegmentedControl does NOT forward `data-testid`, so the scene anchors the root
 * by role + accessible name (see the suite).
 *
 * Modelled on `HTMLRadioButtonGroupDriver`, but selection is read from
 * `aria-checked` and values from `data-value` (the segments are buttons, not
 * native radio `<input>`s).
 */
export class SegmentedControlDriver extends ComponentDriver<{}> implements IInputDriver<string | null> {
  private get itemsLocator(): PartLocator {
    return locatorUtil.append(this.locator, byRole('radio'));
  }

  private itemLocator(value: string): PartLocator {
    return locatorUtil.append(this.locator, byRole('radio'), byAttribute('data-value', value, 'Same'));
  }

  /** The currently selected segment's `data-value`, or `null` when none is selected. */
  async getValue(): Promise<string | null> {
    const selected = locatorUtil.append(this.locator, byRole('radio'), byAttribute('aria-checked', 'true', 'Same'));
    if (!(await this.interactor.exists(selected))) {
      return null;
    }
    return (await this.interactor.getAttribute(selected, 'data-value')) ?? null;
  }

  /**
   * Select the segment whose `data-value` matches `value`.
   * @returns `false` when no such segment exists or it is disabled — Astryx marks
   * a disabled segment with `aria-disabled` (no native `disabled`) and its click
   * handler is a no-op, so clicking would silently not change the selection.
   */
  async setValue(value: string | null): Promise<boolean> {
    if (value == null) {
      throw new Error('SegmentedControl is single-select and cannot be deselected; pass a segment value.');
    }
    const item = this.itemLocator(value);
    if (!(await this.interactor.exists(item)) || (await this.isItemDisabled(value))) {
      return false;
    }
    await this.interactor.click(item);
    return true;
  }

  /** All segment `data-value`s, in DOM order. */
  async getItemValues(): Promise<readonly string[]> {
    const values = await this.interactor.getAttribute(this.itemsLocator, 'data-value', true);
    return values.filter((v): v is string => v != null);
  }

  /** Whether the segment with `value` is disabled (`aria-disabled="true"`). */
  async isItemDisabled(value: string): Promise<boolean> {
    const item = this.itemLocator(value);
    return (await this.interactor.getAttribute(item, 'aria-disabled')) === 'true';
  }

  /** Number of segments. */
  async getItemCount(): Promise<number> {
    return (await this.getItemValues()).length;
  }

  /** The accessible name of the group (`aria-label` on the radiogroup root). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  get driverName(): string {
    return 'AstryxSegmentedControlDriver';
  }
}
