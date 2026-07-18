import { byCssClass, ComponentDriver, IInputDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * The 2-D read/write shape {@link ColorAreaDriver} exchanges: the HSV
 * saturation ("S") and value/brightness ("V") channels, both on Fluent's own
 * `0`–`100` scale (see the class doc — NOT the `0`–`1` fraction the
 * `HsvColor` prop type uses).
 */
export interface ColorAreaValue {
  /** The saturation channel, `0`–`100`. */
  saturation: number;
  /** The value (brightness) channel, `0`–`100`. */
  value: number;
}

/**
 * Driver for the Fluent v9 `ColorArea` component — the 2-D saturation/value
 * picker composed inside a `ColorPicker`, or used standalone.
 *
 * DOM audit (@fluentui/react-components@9.74.3): the locator you place on
 * `<ColorArea>` lands on a REAL `<div class="fui-ColorArea">` — unlike
 * `ColorSlider`, this IS `ColorArea`'s own primary/root slot
 * (`useColorArea_unstable` spreads native div props straight onto `root` via
 * `getIntrinsicElementProps('div', ...)`, with no separate primary slot to
 * redirect to), so `aria-label` forwards (verified), but `disabled`/`required`
 * do NOT (verified: passing either has zero DOM effect — neither is a valid
 * attribute for a plain `<div>`, and `getIntrinsicElementProps` drops
 * attributes the target element type doesn't natively support). `ColorArea`
 * genuinely has no disableable/requirable capability to expose, so this
 * driver implements neither `IDisableableDriver` nor `IRequirableDriver`.
 *
 * Internally it wraps TWO real native `<input type="range">` elements inside
 * a `<div class="fui-ColorArea__thumb">` — `<input class="fui-ColorArea__inputX">`
 * (saturation) and `<input class="fui-ColorArea__inputY">` (value/brightness) —
 * each driven the same way the sibling `ColorSliderDriver` drives its own
 * single native input: `Interactor.setRangeValue`/`getInputValue`, not
 * `aria-valuenow` (there is none on either input) or an Arrow-key loop.
 * Neither input carries an explicit `min`/`max` attribute (confirmed against
 * rendered DOM), so the native range-input default (`0`–`100`) governs both —
 * matching the `0`–`100` scale Fluent renders the channels on (it multiplies
 * the `0`–`1` HSV fraction by `100` before ever setting `.value`).
 *
 * `ColorArea` DOES wire its own custom Arrow-key handling, but on the ROOT
 * `<div>`, not either native input (verified: `ArrowRight` dispatched on the
 * root moves `inputX` by exactly `1`; the identical key dispatched on the
 * FOCUSED native input itself does nothing under jsdom — confirming jsdom
 * does not reproduce a real browser's native range-input Arrow-key stepping,
 * the same gap `ColorSliderDriver`'s class doc records). This driver does not
 * expose that root-level path: {@link setValue} already reaches an exact
 * target in one call in both environments, and nudging from an "active axis"
 * rest position that is itself undocumented internal React state (which of
 * `inputX`/`inputY` receives the Tab focus depends on which one the user last
 * touched) is unverified beyond this one jsdom probe, so it is left out
 * rather than guessed — see the package README's Known gaps.
 */
export class ColorAreaDriver extends ComponentDriver<{}> implements IInputDriver<ColorAreaValue> {
  /** The current saturation/value pair (`0`–`100` each). */
  async getValue(): Promise<ColorAreaValue> {
    const [saturation, value] = await Promise.all([
      this.interactor.getInputValue(this.xInputLocator),
      this.interactor.getInputValue(this.yInputLocator),
    ]);
    return {
      saturation: Number.parseFloat(saturation ?? ''),
      value: Number.parseFloat(value ?? ''),
    };
  }

  /**
   * Drive both channels directly via `Interactor.setRangeValue` — see the
   * class doc for why this is preferred over Arrow-key nudging. Sequential,
   * not concurrent: each mutating call is its own `act()` under
   * `ReactInteractor` (see `ReactInteractor.runInteraction`), and React does
   * not support overlapping `act()` calls. Always resolves `true` (mirrors
   * `HTMLRangeInputDriver.setValue`'s native-range-input contract): a
   * caller-provided out-of-range channel is silently clamped by the browser,
   * the same as any native range input.
   */
  async setValue(value: ColorAreaValue): Promise<boolean> {
    await this.interactor.setRangeValue(this.xInputLocator, value.saturation);
    await this.interactor.setRangeValue(this.yInputLocator, value.value);
    return true;
  }

  /** The area's accessible name (`aria-label`), or `undefined` when unset. */
  async getLabel(): Promise<Optional<string>> {
    return this.getAttribute('aria-label');
  }

  private get xInputLocator(): PartLocator {
    return locatorUtil.append(this.locator, byCssClass('fui-ColorArea__inputX'));
  }

  private get yInputLocator(): PartLocator {
    return locatorUtil.append(this.locator, byCssClass('fui-ColorArea__inputY'));
  }

  get driverName(): string {
    return 'FluentV9ColorAreaDriver';
  }
}
