import { byCssSelector, locatorUtil, Optional } from '@atomic-testing/core';

import { AstryxFieldInputDriver } from './AstryxFieldInputDriver';

/**
 * Driver for the Astryx NumberInput (`@astryxdesign/core/NumberInput`).
 *
 * Astryx 0.4.0 replaced the native `<input type="number">` with a **text-backed
 * spinbutton** — `type="text"` plus `role="spinbutton"` — so it can render
 * formatted display values (thousands separators, currency) that a native number
 * input rejects. The bounds moved with it: `min`/`max` are now `aria-valuemin`/
 * `aria-valuemax`, and the current value is mirrored in `aria-valuenow` alongside
 * the input's own `value`. `data-testid` is still forwarded onto the input, and an
 * optional trailing units `<span>` is still its sibling inside the control
 * container. Value/label/validation come from {@link AstryxFieldInputDriver}.
 *
 * **`step` has no DOM representation.** The native attribute is gone and Astryx
 * keeps the effective step in React state (it clamps and integer-guards it before
 * use), so there is nothing portable to read — hence no `getStep()`. Assert
 * stepping behaviourally through {@link stepUp}/{@link stepDown} and the resulting
 * value instead.
 */
export class NumberInputDriver extends AstryxFieldInputDriver {
  /** Minimum allowed value (`aria-valuemin`), if set. */
  async getMin(): Promise<Optional<number>> {
    return this.readNumericAttribute('aria-valuemin');
  }

  /** Maximum allowed value (`aria-valuemax`), if set. */
  async getMax(): Promise<Optional<number>> {
    return this.readNumericAttribute('aria-valuemax');
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
