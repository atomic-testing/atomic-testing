import { byRole, ComponentDriver, IInputDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { resolveDescribedByRoleText } from '../internal/linkedLocators';

/**
 * Driver for the Astryx Slider (`@astryxdesign/core/Slider`), single-thumb scope.
 *
 * Astryx puts `role="slider"` on the THUMB `<div>` (the root carries the
 * `data-testid` the scene anchors), exposing the value via `aria-valuenow` and
 * the bounds via `aria-valuemin`/`aria-valuemax`. There is no native range
 * `<input>`, so {@link setValue} drives the value by keyboard (Arrow keys), the
 * accessible path the epic prescribes for Wave 1 — pointer drag is deferred to
 * the DRAG infra. Range sliders (two thumbs) are out of scope here; `getValue`
 * returns the first thumb's value.
 */
export class SliderDriver extends ComponentDriver<{}> implements IInputDriver<number> {
  private get thumbLocator(): PartLocator {
    return locatorUtil.append(this.locator, byRole('slider'));
  }

  /** The current value (`aria-valuenow` on the thumb). */
  async getValue(): Promise<number> {
    return this.readThumbNumber('aria-valuenow');
  }

  /** The minimum value (`aria-valuemin`). */
  async getMin(): Promise<number> {
    return this.readThumbNumber('aria-valuemin');
  }

  /** The maximum value (`aria-valuemax`). */
  async getMax(): Promise<number> {
    return this.readThumbNumber('aria-valuemax');
  }

  /**
   * Drive the value to `target` using the keyboard.
   *
   * Focuses the thumb and steps with Arrow keys, reading the live `aria-valuenow`
   * after each press so it works for any step size. Stops when the value reaches
   * `target`, can no longer move (a bound), or steps past `target` (a target off
   * the step grid never settles). The step is not exposed in the DOM, so the loop
   * terminates from the value itself rather than a press budget guessed from the
   * range — a budget sized to the range stops short of a fine-step target.
   * Returns whether `target` was reached exactly.
   */
  async setValue(target: number): Promise<boolean> {
    const thumb = this.thumbLocator;
    await this.interactor.focus(thumb);
    let current = await this.getValue();
    while (current !== target && !Number.isNaN(current)) {
      const movingUp = target > current;
      await this.interactor.pressKey(thumb, movingUp ? 'ArrowRight' : 'ArrowLeft');
      const next = await this.getValue();
      // Stop once the value can't move (a bound) or has stepped past the target
      // (off the step grid) — from here `target` is unreachable, and continuing
      // would oscillate forever.
      if (next === current || (movingUp ? next > target : next < target)) {
        current = next;
        break;
      }
      current = next;
    }
    return current === target;
  }

  /** Whether the slider is disabled (`aria-disabled="true"` on the thumb). */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.thumbLocator, 'aria-disabled')) === 'true';
  }

  /** The slider's accessible name (`aria-label` on the thumb). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.thumbLocator, 'aria-label');
  }

  /**
   * The `disabledMessage` tooltip text, shown when the slider is disabled with
   * a reason. Resolved through the thumb's composed `aria-describedby` — the
   * id list also carries the description/status-message ids, so this picks out
   * whichever target has `role="tooltip"`.
   *
   * Gated on {@link isDisabled}: an enabled thumb's default value bubble
   * (`valueDisplay="tooltip"`, Astryx's live-value preview) is a *second,
   * unrelated* `role="tooltip"` layer linked through the same
   * `aria-describedby`, so probing the DOM unconditionally would surface the
   * current value instead of `undefined`. Astryx suppresses the value bubble
   * only when a disabled-reason message is actually showing, so this can still
   * misreport the value as the message on a slider that is disabled *without*
   * a `disabledMessage` (upstream ambiguity — there is no way to tell the two
   * `role="tooltip"` layers apart from the DOM alone).
   */
  async getDisabledMessage(): Promise<Optional<string>> {
    if (!(await this.isDisabled())) {
      return undefined;
    }
    return resolveDescribedByRoleText(this.interactor, this.thumbLocator, 'aria-describedby', 'tooltip');
  }

  private async readThumbNumber(attribute: string): Promise<number> {
    const raw = await this.interactor.getAttribute(this.thumbLocator, attribute);
    return raw == null ? Number.NaN : Number.parseFloat(raw);
  }

  get driverName(): string {
    return 'AstryxSliderDriver';
  }
}
