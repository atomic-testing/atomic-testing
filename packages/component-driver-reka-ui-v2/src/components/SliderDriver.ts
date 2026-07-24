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
 * Driver for the Reka UI Slider primitive (`SliderRoot`/`SliderTrack`/
 * `SliderRange`/`SliderThumb` from `reka-ui`).
 *
 * DOM audit (reka-ui@2.10.1, SSR-rendered): byte-for-byte the same contract as
 * `component-driver-radix-v1`'s `SliderDriver` — the thumb is `<span
 * role="slider" tabindex="0" aria-valuenow aria-valuemin aria-valuemax
 * aria-label>` (no native `<input type="range">` anywhere; a hidden
 * `VisuallyHiddenInput` only renders inside a `<form>` when `name` is set,
 * which this driver's scene doesn't use — confirmed zero `<input>` elements in
 * the rendered DOM). Disabled state removes the thumb's `tabindex` entirely
 * (confirmed `.focus()` leaves `document.activeElement` unmoved) AND Reka's
 * own `SliderRoot` keydown handler gates every step on its `disabled` ref
 * regardless of focus, so a keyboard step dispatched at the (unfocused)
 * disabled thumb is a verified no-op on `aria-valuenow` — `setValue` therefore
 * needs no explicit disabled guard, matching radix-v1's own driver exactly.
 * `data-disabled` (empty-string) appears on both the root and the thumb when
 * disabled; unlike Reka's Switch/Toggle it carries no plain `disabled`
 * attribute anywhere, since the primitive is a `<span>`, not a native
 * `<button>`.
 *
 * Two portable write paths, same split as radix-v1: keyboard arrows on the
 * thumb (role="slider", works in jsdom+E2E) and the `drag` pointer primitive
 * (E2E-only — jsdom has no layout engine). `setValue` drives the keyboard
 * path; `dragBy` exposes the pointer path for E2E-only positional verification.
 *
 * Scope: single-thumb only. Reka addresses a range (two-thumb) slider's extra
 * thumbs only by `aria-label` auto-falling-back to `"Minimum"`/`"Maximum"`
 * (`SliderThumbImpl`'s `getLabel`) — and that fallback is overridden the
 * moment a consumer sets its own `aria-label` (the recommended, accessible
 * thing to do), so it is not a stable index-addressable anchor the way
 * `component-driver-primevue-v4`'s `SliderDriver` found in PrimeVue's
 * `data-pc-section="starthandler"/"endhandler"` pass-through markers. No
 * comparable per-thumb attribute exists in this DOM audit, so — like
 * radix-v1 — this driver does not expose a range API.
 */
export class SliderDriver extends ComponentDriver<typeof parts> implements IInputDriver<number>, IDisableableDriver {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  async getValue(): Promise<number> {
    return this.readThumbNumber('aria-valuenow');
  }

  async getMin(): Promise<number> {
    return this.readThumbNumber('aria-valuemin');
  }

  async getMax(): Promise<number> {
    return this.readThumbNumber('aria-valuemax');
  }

  async setValue(target: number): Promise<boolean> {
    await this.parts.thumb.focus();
    let current = await this.getValue();
    while (current !== target && !Number.isNaN(current)) {
      const movingUp = target > current;
      await this.parts.thumb.pressKey(movingUp ? 'ArrowRight' : 'ArrowLeft');
      const next = await this.getValue();
      if (next === current || (movingUp ? next > target : next < target)) {
        current = next;
        break;
      }
      current = next;
    }
    return current === target;
  }

  async dragBy(delta: Point): Promise<void> {
    return this.interactor.drag(this.parts.thumb.locator, delta);
  }

  async isDisabled(): Promise<boolean> {
    return (await this.getAttribute('data-disabled')) != null;
  }

  async getLabel(): Promise<Optional<string>> {
    return this.parts.thumb.getAttribute('aria-label');
  }

  private async readThumbNumber(attribute: string): Promise<number> {
    const raw = await this.parts.thumb.getAttribute(attribute);
    return raw == null ? Number.NaN : Number.parseFloat(raw);
  }

  override get driverName(): string {
    return 'RekaUiV2SliderDriver';
  }
}
