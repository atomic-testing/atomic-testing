import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx ProgressBar (`@astryxdesign/core/ProgressBar`).
 *
 * The root `<div>` carries `data-testid` and `data-variant` but is itself
 * ROLELESS — the ARIA semantics live on an inner track `<div>` with
 * `role="progressbar"` in BOTH modes (Astryx 0.1.3 dropped the determinate
 * bar's `role="meter"` — a progress bar conveys task completion and should be
 * announced on update, which `meter`'s static-gauge semantics don't convey).
 * The two modes are now distinguished only by the presence of
 * `aria-valuenow`/`min`/`max`/`text`, which a determinate bar carries and an
 * indeterminate one omits. The driver reads the value attributes off the track
 * and treats their absence as indeterminate. The label is the header
 * `<span id>`; the variant is the root's `data-variant`.
 */
export class ProgressBarDriver extends ComponentDriver<{}> {
  /**
   * The inner track, where the `meter`/`progressbar` role and `aria-value*` live.
   * Anchored on the stable `astryx-progressbar-track` class rather than a
   * `[role=meter],[role=progressbar]` selector list — a comma list would leave the
   * second alternative unscoped (matching another bar's track elsewhere on the
   * page), and the role here switches with mode anyway.
   */
  private get track(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('.astryx-progressbar-track'));
  }

  /** The header label (`<span id>`, referenced by the track's `aria-labelledby`). */
  private get label(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('span[id]'));
  }

  /** The current value (`aria-valuenow`), or `undefined` for an indeterminate bar. */
  async getValueNow(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.track, 'aria-valuenow');
  }

  /** The minimum value (`aria-valuemin`), or `undefined` for an indeterminate bar. */
  async getValueMin(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.track, 'aria-valuemin');
  }

  /** The maximum value (`aria-valuemax`), or `undefined` for an indeterminate bar. */
  async getValueMax(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.track, 'aria-valuemax');
  }

  /** The human-readable value (`aria-valuetext`, e.g. `"75%"`), or `undefined` when indeterminate. */
  async getValueText(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.track, 'aria-valuetext');
  }

  /** The visible label text. */
  async getLabel(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(this.label))) {
      return undefined;
    }
    return (await this.interactor.getText(this.label)) ?? undefined;
  }

  /** The style variant from the root's `data-variant` (e.g. `"accent"`). */
  async getVariant(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-variant');
  }

  /**
   * Whether the bar is indeterminate. Both modes render `role="progressbar"`, so
   * this is read off the presence of `aria-valuenow` instead — indeterminate bars
   * omit it, determinate bars always carry it.
   */
  async isIndeterminate(): Promise<boolean> {
    return (await this.getValueNow()) == null;
  }

  override get driverName(): string {
    return 'AstryxProgressBarDriver';
  }
}
