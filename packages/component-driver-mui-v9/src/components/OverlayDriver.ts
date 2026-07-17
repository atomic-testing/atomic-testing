import { byCssClass, ContainerDriver, locatorUtil, PartLocator, ScenePart } from '@atomic-testing/core';

const backdropLocator = byCssClass('MuiBackdrop-root');
const defaultTransitionDuration = 250;
const closeGraceMs = 150;

/**
 * Shared base for MUI portal-rendered overlays (Drawer today; Dialog, Menu,
 * Popover and SpeedDial are prospective consumers). It owns the open/close
 * lifecycle that {@link DialogDriver} first proved out: `isOpen` derived from the
 * visible surface, `waitForOpen`/`waitForClose` spanning the transition, and
 * `closeByBackdrop`.
 *
 * Subclasses supply {@link getSurfaceLocator} (the element whose visibility means
 * "open") and, when the overlay is portal-rendered, override the static
 * `overriddenParentLocator()`/`overrideLocatorRelativePosition()` portal hooks to re-root.
 *
 * `closeByEscape` is intentionally absent: keyboard dismissal needs a key-press
 * primitive the `Interactor` interface does not yet expose, which would have to be
 * added to every interactor (DOM/React/Vue/Playwright). It is deferred rather than
 * partially implemented.
 */
export abstract class OverlayDriver<ContentT extends ScenePart, T extends ScenePart = {}> extends ContainerDriver<
  ContentT,
  T
> {
  /**
   * Locator of the surface whose visibility reflects the open state (e.g. the
   * drawer/dialog paper).
   */
  protected abstract getSurfaceLocator(): PartLocator;

  /**
   * Locator of the dismissible backdrop. Defaults to MUI's `.MuiBackdrop-root`.
   */
  protected getBackdropLocator(): PartLocator {
    return locatorUtil.append(this.locator, backdropLocator);
  }

  /**
   * Whether the overlay is mounted and its surface is visible. Because of open/close
   * transitions, prefer `waitForOpen()`/`waitForClose()` immediately after an action.
   */
  async isOpen(): Promise<boolean> {
    if (!(await this.exists())) {
      return false;
    }
    return this.interactor.isVisible(this.getSurfaceLocator());
  }

  /**
   * Wait until the overlay is open.
   * @returns true once open within the timeout.
   */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const result = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return result === true;
  }

  /**
   * Wait until the overlay is closed. Polls for up to `timeoutMs`, then allows a
   * further `closeGraceMs` grace period for a real transition timer that's merely
   * running late before giving up (see the fallback below).
   * @returns true once closed, within `timeoutMs` plus the grace period.
   */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const result = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    if (result === false) {
      return true;
    }
    // Under React's act() the close transition can commit only when the polling
    // act block exits (seen with MUI v5 in jsdom), so the loop above can still
    // observe the overlay as open even though the real exit-transition timer is
    // merely running late (e.g. a contended CI runner) rather than genuinely
    // stuck. A short, act()-wrapped grace-period recheck gives that timer real
    // wall-clock time to fire before giving up, instead of a single unwaited
    // snapshot racing the same timer with zero margin.
    const settled = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs: closeGraceMs,
    });
    return settled === false;
  }

  /**
   * Dismiss by clicking the backdrop, then wait for the close transition. Whether
   * it actually closes depends on the consumer honoring the backdrop dismissal; the
   * returned boolean reflects the observed close, not merely the click.
   */
  async closeByBackdrop(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const backdrop = this.getBackdropLocator();
    if (await this.interactor.exists(backdrop)) {
      // A single click suffices in both worlds: a real browser click is a full
      // mouse sequence, and jsdom dispatches the click event MUI's backdrop
      // onClick listens for. (A separate trailing click would race the dismissal
      // and miss the unmounting backdrop in Playwright.)
      await this.interactor.click(backdrop);
    }
    return this.waitForClose(timeoutMs);
  }
}
