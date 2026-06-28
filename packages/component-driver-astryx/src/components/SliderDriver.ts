import { byRole, ComponentDriver, IInputDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

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
   * Focuses the thumb and steps with Arrow keys until `aria-valuenow` reaches
   * `target` (or can no longer move — e.g. a bound or `target` not on the step
   * grid), reading the live value after each press so it works regardless of the
   * configured step. Returns whether `target` was reached exactly.
   */
  async setValue(target: number): Promise<boolean> {
    const thumb = this.thumbLocator;
    await this.interactor.focus(thumb);
    let current = await this.getValue();
    // Bound the loop generously against the value range so a target off the step
    // grid (which never settles exactly) can't spin forever.
    const span = Math.abs((await this.getMax()) - (await this.getMin())) + 2;
    let guard = 0;
    while (current !== target && guard <= span) {
      await this.interactor.pressKey(thumb, target > current ? 'ArrowRight' : 'ArrowLeft');
      const next = await this.getValue();
      if (next === current) {
        break;
      }
      current = next;
      guard++;
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

  private async readThumbNumber(attribute: string): Promise<number> {
    const raw = await this.interactor.getAttribute(this.thumbLocator, attribute);
    return raw == null ? Number.NaN : Number.parseFloat(raw);
  }

  get driverName(): string {
    return 'AstryxSliderDriver';
  }
}
