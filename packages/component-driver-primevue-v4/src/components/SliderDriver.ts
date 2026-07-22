import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
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
  /**
   * The single-thumb handle. Compound-anchored on `data-pc-section="handle"`
   * (not a bare `role="slider"`) specifically so this part genuinely does not
   * exist on a range slider — see the class doc's "Range" section — letting
   * `enforcePartExistence('handle')` reject single-thumb calls with the usual
   * `MissingPartError` instead of silently resolving to the start thumb.
   */
  handle: {
    locator: byCssSelector('[role="slider"][data-pc-section="handle"]'),
    driver: HTMLElementDriver,
  },
  /** The lower thumb of a range (two-thumb) slider. */
  startHandle: {
    locator: byCssSelector('[role="slider"][data-pc-section="starthandler"]'),
    driver: HTMLElementDriver,
  },
  /** The upper thumb of a range (two-thumb) slider. */
  endHandle: {
    locator: byCssSelector('[role="slider"][data-pc-section="endhandler"]'),
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
 * **Range (two-thumb), #1035.** DOM audit (primevue@4.5.5): a range slider
 * renders two `role="slider"` handles distinguished by PrimeVue's own
 * pass-through markers — `data-pc-section="starthandler"` (lower thumb) and
 * `="endhandler"` (upper thumb) — a stable, index-addressable anchor the v1
 * audit hadn't yet found. {@link getRangeValues}/{@link setRangeValues} drive
 * both thumbs through the same keyboard-stepping strategy as {@link setValue};
 * PrimeVue does not clamp one thumb against the other on the keyboard path
 * (only in the pointer-drag path, via `onDragStart`'s `value[0] === max` swap),
 * so pass already-ordered, non-crossing targets (e.g. `[20, 70]`), mirroring
 * the MUI `SliderDriver`'s `setRangeValues` contract.
 *
 * **Vertical orientation, #1035.** DOM audit (primevue@4.5.5): `orientation`
 * changes only the root's `data-p`/CSS-position math and each handle's
 * `aria-orientation` — verified empirically that PrimeVue's own `onKeyDown`
 * treats `ArrowLeft`/`ArrowDown` and `ArrowRight`/`ArrowUp` as synonyms
 * regardless of orientation, so {@link setValue}/{@link getValue}/{@link getMin}/
 * {@link getMax} need no orientation-specific branch at all — the existing
 * horizontal keyboard path already drives a vertical slider. {@link getOrientation}
 * reads the one thing that does vary, `aria-orientation`, off whichever handle
 * is present.
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

  /** The current value (`aria-valuenow` on the single-thumb handle). */
  async getValue(): Promise<number> {
    await this.enforcePartExistence('handle');
    return this.readHandleNumber(this.parts.handle, 'aria-valuenow');
  }

  /** The minimum value (`aria-valuemin` on the single-thumb handle). */
  async getMin(): Promise<number> {
    await this.enforcePartExistence('handle');
    return this.readHandleNumber(this.parts.handle, 'aria-valuemin');
  }

  /** The maximum value (`aria-valuemax` on the single-thumb handle). */
  async getMax(): Promise<number> {
    await this.enforcePartExistence('handle');
    return this.readHandleNumber(this.parts.handle, 'aria-valuemax');
  }

  /**
   * Drive the value to `target` using the keyboard: focuses the handle and
   * steps with Arrow keys, reading the live `aria-valuenow` after each press so
   * it works for any `step` — PrimeVue does not expose the step in the DOM.
   * Stops when the value reaches `target`, can no longer move (a bound), or
   * steps past `target` (off the step grid, unreachable from here). Returns
   * whether `target` was reached exactly. Single-thumb only — see
   * {@link setRangeValues} for a range slider.
   */
  async setValue(target: number): Promise<boolean> {
    await this.enforcePartExistence('handle');
    return this.stepHandleToTarget(this.parts.handle, target);
  }

  /** The current `[lower, upper]` values of a range slider (`aria-valuenow` on each thumb). */
  async getRangeValues(): Promise<[number, number]> {
    await this.enforcePartExistence(['startHandle', 'endHandle']);
    const lower = await this.readHandleNumber(this.parts.startHandle, 'aria-valuenow');
    const upper = await this.readHandleNumber(this.parts.endHandle, 'aria-valuenow');
    return [lower, upper];
  }

  /**
   * Drive both thumbs of a range slider to `[lower, upper]` via the same
   * keyboard-stepping strategy as {@link setValue}, one thumb at a time. Pass
   * already-ordered, non-crossing targets — see the class doc's "Range" note.
   * @returns whether both thumbs reached their exact targets
   */
  async setRangeValues(values: readonly [number, number]): Promise<boolean> {
    await this.enforcePartExistence(['startHandle', 'endHandle']);
    const [lowerTarget, upperTarget] = values;
    const lowerReached = await this.stepHandleToTarget(this.parts.startHandle, lowerTarget);
    const upperReached = await this.stepHandleToTarget(this.parts.endHandle, upperTarget);
    return lowerReached && upperReached;
  }

  /**
   * The slider's orientation (`aria-orientation`), read off whichever handle
   * is present — the single-thumb handle, or (on a range slider) the start
   * thumb.
   */
  async getOrientation(): Promise<'horizontal' | 'vertical'> {
    const handle = (await this.interactor.exists(this.parts.handle.locator))
      ? this.parts.handle
      : this.parts.startHandle;
    const raw = await handle.getAttribute('aria-orientation');
    return raw === 'vertical' ? 'vertical' : 'horizontal';
  }

  /**
   * Drag the handle by `delta` pixels — the pointer-driven counterpart to
   * {@link setValue}. E2E-only: jsdom has no layout engine, so the drag has no
   * positional outcome there (see {@link Interactor.drag}); the call still
   * resolves without throwing under jsdom, exercising the event wiring only.
   * Single-thumb only — see {@link dragRangeHandleBy} for a range slider.
   */
  async dragBy(delta: Point): Promise<void> {
    // drag is protected on ComponentDriver (#1045); reach the child handle's
    // gesture through the interactor and the child's resolved locator.
    return this.interactor.drag(this.parts.handle.locator, delta);
  }

  /**
   * Drag one thumb of a range slider by `delta` pixels — the pointer-driven
   * counterpart to {@link setRangeValues}. E2E-only, see {@link dragBy}.
   */
  async dragRangeHandleBy(thumb: 'lower' | 'upper', delta: Point): Promise<void> {
    const handle = thumb === 'lower' ? this.parts.startHandle : this.parts.endHandle;
    return this.interactor.drag(handle.locator, delta);
  }

  /** Whether the slider is disabled (`p-disabled` state class on the root — see class doc). */
  isDisabled(): Promise<boolean> {
    return this.interactor.hasCssClass(this.locator, 'p-disabled');
  }

  private async stepHandleToTarget(handle: HTMLElementDriver, target: number): Promise<boolean> {
    await handle.focus();
    let current = await this.readHandleNumber(handle, 'aria-valuenow');
    while (current !== target && !Number.isNaN(current)) {
      const movingUp = target > current;
      await handle.pressKey(movingUp ? 'ArrowRight' : 'ArrowLeft');
      const next = await this.readHandleNumber(handle, 'aria-valuenow');
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

  private async readHandleNumber(handle: HTMLElementDriver, attribute: string): Promise<number> {
    const raw = await handle.getAttribute(attribute);
    return raw == null ? Number.NaN : Number.parseFloat(raw);
  }

  get driverName(): string {
    return 'PrimeVueV4SliderDriver';
  }
}
