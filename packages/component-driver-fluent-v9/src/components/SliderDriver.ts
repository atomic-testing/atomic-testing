import { HTMLRangeInputDriver } from '@atomic-testing/component-driver-html';
import { IRequirableDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `Slider` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): the `data-testid`/locator you
 * put on `<Slider>` forwards straight to a REAL native
 * `<input class="fui-Slider__input" type="range">` — Fluent's own slot docs call
 * this the slider's PRIMARY slot ("all native properties specified directly on
 * `<Slider>` will be applied to this slot"), confirmed against the rendered DOM:
 * `min`/`max`/`step`/`required`/`aria-label`/`value`/`disabled` all land on it as
 * plain native attributes/properties, exactly `HTMLRangeInputDriver`'s existing
 * contract — so this driver extends it wholesale (native `getValue`/`setValue`
 * via `Interactor.getInputValue`/`setRangeValue`, plus `isDisabled`, already
 * apply unchanged) and adds only what's Fluent-specific. The visible rail/thumb
 * render as separate SIBLING `<div class="fui-Slider__rail">`/
 * `<div class="fui-Slider__thumb">` elements with no interactive semantics of
 * their own (no `role`, no `tabindex` — purely CSS-positioned off the input's
 * live value via a CSS custom property); the package's own type declarations
 * describe the thumb slot as "containing `role='slider'`", but the rendered DOM
 * has no such attribute anywhere — the accessible slider semantics come for
 * free from the native `<input type="range">`'s implicit ARIA mapping, not from
 * any div. `role`/`aria-value*` are therefore never read here (unlike the pure-
 * ARIA Radix/Astryx sliders, which have no native input to fall back on).
 *
 * Fluent only stamps the `min`/`max`/`step` attributes when the matching prop is
 * explicitly passed — a `<Slider>` rendered with none of them has NEITHER
 * attribute in the DOM, even though Fluent's own documented defaults (`min={0}`,
 * `max={100}`, `step={1}`) still govern the rendered/clamped value identically
 * (matching the native `<input type="range">` spec's own defaults). {@link getMin},
 * {@link getMax}, and {@link getStep} fall back to those same defaults instead of
 * surfacing `NaN`/`null` for an omitted prop that still has real, defined behavior.
 *
 * Scope: single-thumb only — Fluent v9 ships no multi-thumb/range variant of
 * `Slider` (`SliderProps.value`/`defaultValue` is a single `number`, never an
 * array), so there is no multi-thumb gap to record here.
 *
 * Extending `HTMLRangeInputDriver` also inherits its `isReadonly()`. Fluent's
 * `Slider` has no documented `readOnly` prop, and the native `readonly`
 * attribute has no defined effect on `type="range"` per the HTML spec (the same
 * restriction `CheckboxDriver` notes for `type="checkbox"`), so that method only
 * reflects an `aria-readonly` a caller sets directly — inherited, not a genuine
 * Fluent Slider capability.
 */
export class SliderDriver extends HTMLRangeInputDriver implements IRequirableDriver {
  /**
   * The minimum value of the slider (the input's native `min` attribute),
   * falling back to Fluent's documented default of `0` when the `min` prop
   * was never passed (see class doc).
   */
  async getMin(): Promise<number> {
    return this.readBoundedNumber('min', 0);
  }

  /**
   * The maximum value of the slider (the input's native `max` attribute),
   * falling back to Fluent's documented default of `100` when the `max` prop
   * was never passed (see class doc).
   */
  async getMax(): Promise<number> {
    return this.readBoundedNumber('max', 100);
  }

  /**
   * The slider's step increment (the input's native `step` attribute), falling
   * back to Fluent's documented default of `1` when the `step` prop was never
   * passed (see class doc). Fluent's `step` has no "unset"/free-movement variant
   * (unlike some other design systems' sliders), so this never returns `null`.
   */
  async getStep(): Promise<number> {
    return this.readBoundedNumber('step', 1);
  }

  /** Whether the slider is marked required (native `required` attribute). */
  isRequired(): Promise<boolean> {
    return this.interactor.isRequired(this.locator);
  }

  /**
   * The slider's accessible name, read from a directly-set `aria-label` on the
   * input, or `undefined` when none is present. Fluent's `Slider` has no `label`
   * prop of its own (unlike `Checkbox`/`Radio`/`Switch`) — a caller either sets
   * `aria-label` directly (what this reads) or wraps the slider in a `Field`,
   * whose own driver owns that label read instead.
   */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  private async readBoundedNumber(attribute: string, fallback: number): Promise<number> {
    const raw = await this.interactor.getAttribute(this.locator, attribute);
    return raw == null ? fallback : Number.parseFloat(raw);
  }

  override get driverName(): string {
    return 'FluentV9SliderDriver';
  }
}
