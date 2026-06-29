import { byCssSelector, locatorUtil, Optional } from '@atomic-testing/core';

import { AstryxFieldInputDriver } from './AstryxFieldInputDriver';

/**
 * Driver for the Astryx NumberInput (`@astryxdesign/core/NumberInput`).
 *
 * NumberInput renders an `<input type="number">` (forwarding `data-testid` onto
 * it) with the `min`/`max`/`step` constraints as native attributes and an
 * optional trailing units `<span>` as a sibling inside the control container.
 * Value/label/validation come from {@link AstryxFieldInputDriver}.
 */
export class NumberInputDriver extends AstryxFieldInputDriver {
  /** Minimum allowed value (`min` attribute), if set. */
  async getMin(): Promise<Optional<number>> {
    return this.readNumericAttribute('min');
  }

  /** Maximum allowed value (`max` attribute), if set. */
  async getMax(): Promise<Optional<number>> {
    return this.readNumericAttribute('max');
  }

  /** Step increment (`step` attribute), if set. */
  async getStep(): Promise<Optional<number>> {
    return this.readNumericAttribute('step');
  }

  /**
   * The trailing units label (e.g. `"kg"`, `"%"`), if present.
   *
   * The units `<span>` is a trailing sibling of the `<input>` inside the control
   * container, so it's reached as a sibling of the anchored input (excluding the
   * decorative, `aria-hidden` status/start icons) — no `:has()` re-rooting or raw
   * chain-selector interpolation needed.
   */
  async getUnits(): Promise<Optional<string>> {
    const unitsLocator = locatorUtil.append(this.locator, byCssSelector('~ span:not([aria-hidden="true"])'));
    if (!(await this.interactor.exists(unitsLocator))) {
      return undefined;
    }
    return (await this.interactor.getText(unitsLocator)) ?? undefined;
  }

  /** Increment the value one step via the ArrowUp key. */
  async stepUp(): Promise<void> {
    await this.interactor.pressKey(this.locator, 'ArrowUp');
  }

  /** Decrement the value one step via the ArrowDown key. */
  async stepDown(): Promise<void> {
    await this.interactor.pressKey(this.locator, 'ArrowDown');
  }

  private async readNumericAttribute(name: string): Promise<Optional<number>> {
    const raw = await this.interactor.getAttribute(this.locator, name);
    return raw == null ? undefined : Number.parseFloat(raw);
  }

  override get driverName(): string {
    return 'AstryxNumberInputDriver';
  }
}
