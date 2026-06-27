import { HTMLRadioButtonGroupDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  byCssSelector,
  byInputType,
  byValue,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  locatorUtil,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
  choices: {
    locator: byInputType('radio'),
    driver: HTMLRadioButtonGroupDriver,
  },
} satisfies ScenePart;

/**
 * MUI marks the disabled/read-only state with a class on the Rating root span
 * (`Mui-disabled` / `Mui-readOnly`), not on the visually-hidden radio inputs that
 * the composed {@link HTMLRadioButtonGroupDriver} can see — so these states are
 * only observable from the root element.
 */
const disabledClassName = 'Mui-disabled';
const readOnlyClassName = 'Mui-readOnly';
const filledIconClassName = 'MuiRating-iconFilled';

export class RatingDriver extends ComponentDriver<typeof parts> implements IInputDriver<number | null> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  async getValue(): Promise<number | null> {
    // A read-only Rating renders no radio inputs (root becomes `role="img"` with the
    // value carried in `aria-label`), so the radio-based read below cannot be used.
    const isReadOnly = await this.interactor.hasCssClass(this.locator, readOnlyClassName);
    if (isReadOnly) {
      return this.getReadOnlyValue();
    }

    await this.enforcePartExistence('choices');
    const value = await this.parts.choices.getValue();
    // The "no rating" state is the visually-hidden radio whose `value` attribute is the
    // empty string; treat it the same as an absent selection.
    if (value == null || value === '') {
      return null;
    }
    return parseFloat(value);
  }

  /**
   * Read the value of a read-only Rating.
   *
   * Primary source is the root's `aria-label`, which MUI populates with the accessible
   * name (e.g. `"2.5 Stars"`) — accessibility-first and precision-accurate. When a
   * caller supplies a custom, non-numeric `aria-label`, fall back to counting the
   * filled star icons; that count is exact for whole-star ratings.
   */
  private async getReadOnlyValue(): Promise<number | null> {
    const label = await this.interactor.getAttribute(this.locator, 'aria-label');
    if (label != null) {
      const parsed = parseFloat(label);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }

    const filledLocator = locatorUtil.append(this.locator, byCssClass(filledIconClassName));
    const filledIcons = await this.interactor.getAttribute(filledLocator, 'class', true);
    return filledIcons.length > 0 ? filledIcons.length : null;
  }

  /**
   * Whether the Rating is disabled. `disabled` is reflected as the `Mui-disabled`
   * class on the root span (the composed radio-group driver exposes no `isDisabled`).
   */
  async isDisabled(): Promise<boolean> {
    return this.interactor.hasCssClass(this.locator, disabledClassName);
  }

  async setValue(value: number | null): Promise<boolean> {
    const currentValue = await this.getValue();
    if (value === currentValue) {
      return true;
    }

    // Clearing (value == null) reuses MUI's "click the selected star again to
    // reset" behaviour by re-clicking the current value's label. This resets the
    // rating in real browsers but not in jsdom, where MUI's clear path depends on
    // pointer coordinates that jsdom does not provide; the empty radio (`value=""`)
    // that jsdom could click has no `<label>` and is not reliably clickable in
    // browsers. A fully portable clear needs a coordinate-free click primitive on
    // the Interactor. TODO(#68): revisit once that primitive exists.
    const valueToClick = value ?? currentValue;
    if (valueToClick == null) {
      return true;
    }

    const targetLocator = locatorUtil.append(this.parts.choices.locator, byValue(valueToClick.toString(), 'Same'));
    const targetExists = await this.interactor.exists(targetLocator);
    if (targetExists) {
      const id = await this.interactor.getAttribute(targetLocator, 'id');
      const labelLocator = locatorUtil.append(this.locator, byCssSelector(`label[for="${id}"]`));
      await this.interactor.click(labelLocator);
    }
    // TODO: throw error if the value does not exist
    return targetExists;
  }

  get driverName(): string {
    return 'MuiV5RatingDriver';
  }
}
