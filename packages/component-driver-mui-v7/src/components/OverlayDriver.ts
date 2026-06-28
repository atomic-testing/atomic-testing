import { byCssClass, ContainerDriver, locatorUtil, PartLocator, ScenePart } from '@atomic-testing/core';

const backdropLocator = byCssClass('MuiBackdrop-root');
const defaultTransitionDuration = 250;

/**
 * Shared base for MUI portal-rendered overlays (Drawer today; Dialog, Menu,
 * Popover and SpeedDial are prospective consumers). It owns the open/close
 * lifecycle that {@link DialogDriver} first proved out: `isOpen` derived from the
 * visible surface, `waitForOpen`/`waitForClose` spanning the transition, and
 * dismissal via `closeByBackdrop`/`closeByEscape`.
 *
 * Subclasses supply {@link getSurfaceLocator} (the element whose visibility means
 * "open") and, when the overlay is portal-rendered, override
 * `overriddenParentLocator()`/`overrideLocatorRelativePosition()` to re-root.
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
   * Wait until the overlay is closed.
   * @returns true once closed within the timeout.
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
    // act block exits (seen with MUI v5 in jsdom), so the loop above observes the
    // overlay as still open. A final fresh read reflects the now-committed state.
    return !(await this.isOpen());
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

  /**
   * Dismiss by pressing `Escape` on the overlay surface, then wait for the close
   * transition. MUI's Modal handles a `keydown` of `Escape` (reason
   * `"escapeKeyDown"`) at the portal root; the event bubbles there from the
   * focused surface — a code path distinct from {@link closeByBackdrop} and
   * unreachable by any click, since a click never produces a key event. The
   * surface is the focus-holding element while the overlay is open, mirroring how
   * {@link DialogDriver} presses Escape on its container. Whether it actually
   * closes depends on the consumer honoring the dismissal (and
   * `disableEscapeKeyDown`); the returned boolean reflects the observed close, not
   * merely the key press.
   */
  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const surface = this.getSurfaceLocator();
    if (await this.interactor.exists(surface)) {
      await this.interactor.pressKey(surface, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }
}
