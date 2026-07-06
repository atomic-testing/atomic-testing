import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  IDisableableDriver,
  IInputDriver,
  Interactor,
  Optional,
  PartLocator,
  Point,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
  thumb: {
    locator: byRole('slider'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Driver for the Radix Slider primitive (`Slider.Root` from `radix-ui`).
 *
 * Radix renders NO native `<input type="range">` — only a hidden, non-interactive
 * bubble input inside a `<form>` — so `Interactor.setRangeValue` (built for a real
 * range input, see MUI's `SliderDriver`) does not apply here. The Wave 0
 * capability-gap audit verified two portable write paths instead: keyboard arrows
 * on the thumb (`role="slider"`, works identically in jsdom and E2E since it is
 * pure event/state wiring, no geometry) and the `drag` pointer primitive (E2E-only
 * — jsdom has no layout engine, so a drag has no positional outcome there).
 * {@link setValue} drives the keyboard path so both environments exercise it, per
 * the epic's DoD; {@link dragBy} exposes the pointer path for E2E-only positional
 * verification.
 *
 * Scope: single-thumb, mirroring the Astryx `SliderDriver` — a multi-thumb (range)
 * slider has no verified index-addressable thumb attribute in the rendered DOM (no
 * `data-index` or similar), so reliable multi-thumb addressing is deferred until a
 * range-slider scene is audited.
 */
export class SliderDriver extends ComponentDriver<typeof parts> implements IInputDriver<number>, IDisableableDriver {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  /** The current value (`aria-valuenow` on the thumb). */
  async getValue(): Promise<number> {
    return this.readThumbNumber('aria-valuenow');
  }

  /** The minimum value (`aria-valuemin` on the thumb). */
  async getMin(): Promise<number> {
    return this.readThumbNumber('aria-valuemin');
  }

  /** The maximum value (`aria-valuemax` on the thumb). */
  async getMax(): Promise<number> {
    return this.readThumbNumber('aria-valuemax');
  }

  /**
   * Drive the value to `target` using the keyboard: focuses the thumb and steps
   * with Arrow keys, reading the live `aria-valuenow` after each press so it works
   * for any step size — Radix does not expose the step in the DOM. Stops when the
   * value reaches `target`, can no longer move (a bound), or steps past `target`
   * (off the step grid, unreachable from here). Returns whether `target` was
   * reached exactly.
   */
  async setValue(target: number): Promise<boolean> {
    await this.parts.thumb.focus();
    let current = await this.getValue();
    while (current !== target && !Number.isNaN(current)) {
      const movingUp = target > current;
      await this.parts.thumb.pressKey(movingUp ? 'ArrowRight' : 'ArrowLeft');
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
   * Drag the thumb by `delta` pixels — the pointer-driven counterpart to
   * {@link setValue}. E2E-only: jsdom has no layout engine, so the drag has no
   * positional outcome there (see {@link Interactor.drag}); the call still
   * resolves without throwing under jsdom, exercising the event wiring only.
   */
  async dragBy(delta: Point): Promise<void> {
    return this.parts.thumb.drag(delta);
  }

  /** Whether the slider is disabled (`data-disabled` presence on the root). */
  async isDisabled(): Promise<boolean> {
    return (await this.getAttribute('data-disabled')) != null;
  }

  /** The slider's accessible name (`aria-label` on the thumb). */
  async getLabel(): Promise<Optional<string>> {
    return this.parts.thumb.getAttribute('aria-label');
  }

  private async readThumbNumber(attribute: string): Promise<number> {
    const raw = await this.parts.thumb.getAttribute(attribute);
    return raw == null ? Number.NaN : Number.parseFloat(raw);
  }

  override get driverName(): string {
    return 'RadixV1SliderDriver';
  }
}
