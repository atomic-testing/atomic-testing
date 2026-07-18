import { HTMLRangeInputDriver } from '@atomic-testing/component-driver-html';
import { IRequirableDriver, IValidatableDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `ColorSlider` component — the 1-D channel slider
 * (hue by default) composed inside a `ColorPicker`, or used standalone.
 *
 * DOM audit (@fluentui/react-components@9.74.3): the `data-testid`/locator
 * you put on `<ColorSlider>` forwards straight to a REAL native
 * `<input class="fui-ColorSlider__input" type="range">` — `useColorSlider_unstable`
 * declares `primarySlotTagName: 'input'` and excludes only `onChange`/`color`
 * from native-prop forwarding, so `min`/`max`/`required`/`aria-label`/
 * `aria-invalid`/`disabled`/`value` all land on it as plain native
 * attributes/properties — the SAME shape the sibling standalone `SliderDriver`
 * in this package documents, so this driver extends `HTMLRangeInputDriver`
 * wholesale (native `getValue`/`setValue` via `Interactor.getInputValue`/
 * `setRangeValue`, plus `isDisabled`/`isReadonly`, apply unchanged) and adds
 * only what's Fluent-specific. The visible rail/thumb render as separate
 * SIBLING `<div class="fui-ColorSlider__rail">`/`<div class="fui-ColorSlider__thumb">`
 * elements inside a wrapping `<div role="group" class="fui-ColorSlider">` —
 * none of the three carry the locator; the accessible slider semantics come
 * for free from the native `<input type="range">`'s implicit ARIA mapping,
 * confirmed against the rendered DOM (no `role`/`aria-value*` anywhere on the
 * wrapper or the rail/thumb divs).
 *
 * Fluent always stamps BOTH `min`/`max` on the input regardless of the
 * `channel` prop (`min={0}`; `max={360}` for the default `channel="hue"`,
 * `max={100}` for `"saturation"`/`"value"`) — unlike the standalone `Slider`
 * (whose `min`/`max`/`step` only appear when the matching prop is explicitly
 * passed), there is no "prop never passed" case here, so {@link getMin}/
 * {@link getMax} read the attributes directly with no fallback default.
 *
 * Verified against the rendered DOM that jsdom does NOT implement a real
 * browser's native range-input Arrow-key stepping (that behavior lives in the
 * browser's own widget rendering, not something React/Fluent wires up as a
 * key handler): dispatching `ArrowRight` on the focused input left `value`
 * unchanged under jsdom. `setValue` (inherited from `HTMLRangeInputDriver`)
 * therefore drives the value the way the sibling `SliderDriver` does — through
 * `Interactor.setRangeValue` — rather than the Radix/Astryx pure-ARIA
 * sliders' Arrow-key loop, which does not apply here: there IS a real native
 * input backing this control, and jsdom does not simulate its native keyboard
 * behavior.
 *
 * Scope: only the default `channel="hue"` composition (a `ColorPicker`'s hue
 * slider, what `ColorPickerDriver` wires up) is exercised by this wave's test
 * suite. `channel="saturation"`/`"value"` and a fully standalone `ColorSlider`
 * render the identical native-input shape this driver already targets, so no
 * separate driver is needed for them, but they are unverified here. There is
 * no `channel="alpha"` in this version of `@fluentui/react-color-picker`
 * (audited: the internal channel-action map has no `alpha` case, so passing
 * `channel="alpha"` silently falls back to the hue action) — see the package
 * README's Known gaps.
 */
export class ColorSliderDriver extends HTMLRangeInputDriver implements IRequirableDriver, IValidatableDriver {
  /** The minimum value (native `min` attribute — always present, see class doc). */
  async getMin(): Promise<number> {
    return this.readBoundedNumber('min');
  }

  /** The maximum value (native `max` attribute — always present, see class doc). */
  async getMax(): Promise<number> {
    return this.readBoundedNumber('max');
  }

  /** Whether the slider is marked required (native `required` attribute). */
  isRequired(): Promise<boolean> {
    return this.interactor.isRequired(this.locator);
  }

  /** Whether the slider is in an invalid/error state (`aria-invalid="true"`). */
  isError(): Promise<boolean> {
    return this.interactor.isError(this.locator);
  }

  /**
   * The slider's accessible name, read from a directly-set `aria-label` on
   * the input, or `undefined` when none is present. Like the standalone
   * `Slider`, `ColorSlider` has no `label` prop of its own — a caller either
   * sets `aria-label` directly (what this reads) or wraps it in a `Field`.
   */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  private async readBoundedNumber(attribute: string): Promise<number> {
    const raw = await this.interactor.getAttribute(this.locator, attribute);
    return raw == null ? Number.NaN : Number.parseFloat(raw);
  }

  override get driverName(): string {
    return 'FluentV9ColorSliderDriver';
  }
}
