import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx Spinner (`@astryxdesign/core/Spinner`).
 *
 * Spinner's structure is CONDITIONAL on whether it has a visible label:
 * - Unlabeled — the root IS the `<span role="status" aria-label>` (testid on it).
 * - Labeled — the root is a roleless `<div>` wrapping the `role="status"` span
 *   plus a visible label `<span class="astryx-text">`.
 *
 * So the role's `aria-label` (the accessible name, defaulting to `"Loading"`)
 * lives on the root in the unlabeled case but on a descendant in the labeled
 * case. {@link getAccessibleName} reads the root first and falls back to the
 * descendant. The size is the root's `data-size`. (The spinner draws onto a
 * `<canvas>`; jsdom logs a non-fatal `getContext` warning that does not affect
 * these structural reads.)
 */
export class SpinnerDriver extends ComponentDriver<{}> {
  /** The `role="status"` span — the root itself when unlabeled, a descendant when labeled. */
  private get statusRegion(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('[role="status"]'));
  }

  /** The visible label (`astryx-text`), present only when a `label` is supplied. */
  private get visibleLabel(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('.astryx-text'));
  }

  /**
   * The accessible name (`aria-label`, default `"Loading"`). Read from the root
   * when the root itself carries the role (unlabeled), otherwise from the
   * descendant `role="status"` span (labeled).
   */
  async getAccessibleName(): Promise<Optional<string>> {
    const rootLabel = await this.getAttribute('aria-label');
    if (rootLabel != null) {
      return rootLabel;
    }
    if (!(await this.interactor.exists(this.statusRegion))) {
      return undefined;
    }
    return this.interactor.getAttribute(this.statusRegion, 'aria-label');
  }

  /** The visible label text, or `undefined` when the spinner has no visible label. */
  async getLabelText(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(this.visibleLabel))) {
      return undefined;
    }
    return (await this.interactor.getText(this.visibleLabel)) ?? undefined;
  }

  /** The size token from the root's `data-size`. */
  async getSize(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-size');
  }

  override get driverName(): string {
    return 'AstryxSpinnerDriver';
  }
}
