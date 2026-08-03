import {
  ComponentDriver,
  ElementNotFoundError,
  IComponentDriverOption,
  IDisableableDriver,
  IInputDriver,
  Interactor,
  IReadonlyableDriver,
  PartLocator,
} from '@atomic-testing/core';

/**
 * Driver for a range input (`<input type="range">`), the native control behind a
 * slider. The value is read from the input's `value` property (the browser-stable
 * source for the *current* value — unlike the `value` attribute, which keeps the
 * initial value after a programmatic change) and written through the dedicated
 * {@link Interactor.setRangeValue} primitive, since a range input accepts no typed
 * text and a positional click yields only a coordinate-derived value.
 */
export class HTMLRangeInputDriver
  extends ComponentDriver<{}>
  implements IInputDriver<number>, IDisableableDriver, IReadonlyableDriver
{
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: {},
    });
  }

  /**
   * Read the current value of the range input.
   *
   * Throws {@link ElementNotFoundError} when the element is absent, rather than
   * reporting absence in the return value. A range's value is a `number`, which has
   * no spare inhabitant for "nothing found" — the sibling drivers can say
   * `Nullable<string>` because `null` is a legitimate form value for them, whereas
   * this read previously returned `Number.parseFloat('')` — `NaN` — so every
   * comparison against a missing slider was silently false. See ADR-006 §7.
   *
   * @throws {ElementNotFoundError} If the range input is not found.
   */
  async getValue(): Promise<number> {
    const value = await this.interactor.getInputValue(this.locator);
    if (value == null) {
      throw new ElementNotFoundError(this.locator, 'getValue');
    }
    return Number.parseFloat(value);
  }

  /**
   * Set the value of the range input. The browser snaps an off-step target to the
   * nearest valid step; jsdom stores it verbatim. Pass a step-aligned value for
   * assertions that must hold in both environments.
   */
  async setValue(value: number): Promise<boolean> {
    await this.interactor.setRangeValue(this.locator, value);
    return true;
  }

  /**
   * Check whether the range input is disabled.
   */
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  /**
   * Check whether the range input is read only.
   */
  isReadonly(): Promise<boolean> {
    return this.interactor.isReadonly(this.locator);
  }

  /**
   * Identifier for this driver.
   */
  get driverName(): string {
    return 'HTMLRangeInput';
  }
}
