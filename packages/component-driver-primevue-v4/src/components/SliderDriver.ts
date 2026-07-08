import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  IDisableableDriver,
  IInputDriver,
  Interactor,
  PartLocator,
  Point,
  ScenePart,
} from '@atomic-testing/core';

export const sliderParts = {
  handle: {
    locator: byRole('slider'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Driver for the PrimeVue `Slider` component.
 *
 * DOM audit (primevue@4.5.5): renders NO native `<input type="range">` — the
 * root `<div data-pc-name="slider">` holds a `<span role="slider">` handle
 * carrying `aria-valuenow`/`aria-valuemin`/`aria-valuemax` (PrimeVue's
 * published slider a11y contract), so `Interactor.setRangeValue` (built for a
 * real range input, see MUI's `SliderDriver`) does not apply. Reads come from
 * the handle's aria attributes; {@link setValue} drives the keyboard path
 * (Arrow keys on the focused handle — pure event/state wiring that works
 * identically in jsdom and E2E, since jsdom has no layout for a positional
 * drag), the same split the Radix `SliderDriver` established. {@link dragBy}
 * exposes the pointer path for E2E-only positional verification.
 *
 * Disabled state: PrimeVue renders no `disabled`/`aria-disabled` attribute
 * anywhere on a disabled slider — the only DOM signal is PrimeVue's own
 * `p-disabled` state class on the root (a component-state marker from
 * PrimeVue's core CSS contract, not a theme class; its `data-p` attribute
 * carries only the orientation). {@link isDisabled} therefore reads that
 * class, the one documented exception to this package's attribute-first rule.
 *
 * Scope: single-handle, horizontal (a range slider renders two identical
 * `role="slider"` handles with no index-addressable attribute; vertical only
 * changes the arrow-key axis PrimeVue itself normalizes). Both are deferred
 * until a range/vertical scene is audited.
 */
export class SliderDriver
  extends ComponentDriver<typeof sliderParts>
  implements IInputDriver<number>, IDisableableDriver
{
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: sliderParts,
    });
  }

  /** The current value (`aria-valuenow` on the handle). */
  async getValue(): Promise<number> {
    return this.readHandleNumber('aria-valuenow');
  }

  /** The minimum value (`aria-valuemin` on the handle). */
  async getMin(): Promise<number> {
    return this.readHandleNumber('aria-valuemin');
  }

  /** The maximum value (`aria-valuemax` on the handle). */
  async getMax(): Promise<number> {
    return this.readHandleNumber('aria-valuemax');
  }

  /**
   * Drive the value to `target` using the keyboard: focuses the handle and
   * steps with Arrow keys, reading the live `aria-valuenow` after each press so
   * it works for any `step` — PrimeVue does not expose the step in the DOM.
   * Stops when the value reaches `target`, can no longer move (a bound), or
   * steps past `target` (off the step grid, unreachable from here). Returns
   * whether `target` was reached exactly.
   */
  async setValue(target: number): Promise<boolean> {
    await this.parts.handle.focus();
    let current = await this.getValue();
    while (current !== target && !Number.isNaN(current)) {
      const movingUp = target > current;
      await this.parts.handle.pressKey(movingUp ? 'ArrowRight' : 'ArrowLeft');
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

  /**
   * Drag the handle by `delta` pixels — the pointer-driven counterpart to
   * {@link setValue}. E2E-only: jsdom has no layout engine, so the drag has no
   * positional outcome there (see {@link Interactor.drag}); the call still
   * resolves without throwing under jsdom, exercising the event wiring only.
   */
  async dragBy(delta: Point): Promise<void> {
    // drag is protected on ComponentDriver (#1045); reach the child handle's
    // gesture through the interactor and the child's resolved locator.
    return this.interactor.drag(this.parts.handle.locator, delta);
  }

  /** Whether the slider is disabled (`p-disabled` state class on the root — see class doc). */
  isDisabled(): Promise<boolean> {
    return this.interactor.hasCssClass(this.locator, 'p-disabled');
  }

  private async readHandleNumber(attribute: string): Promise<number> {
    const raw = await this.parts.handle.getAttribute(attribute);
    return raw == null ? Number.NaN : Number.parseFloat(raw);
  }

  get driverName(): string {
    return 'PrimeVueV4SliderDriver';
  }
}
