import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byLinkedElement,
  byRole,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  locatorUtil,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { overlayBackdropLocator, overlayContainerLocator } from '../internal/overlayLocators';

export const dialogParts = {
  /**
   * The CDK backdrop behind the dialog — the surface a "click outside"
   * lands on. It covers the whole viewport, so dismissal clicks target a
   * corner to stay clear of the centered dialog pane.
   */
  backdrop: {
    locator: overlayBackdropLocator,
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Upper bound for the open/close transitions (Material animates ~150ms in,
 * ~75ms out). `waitUntil` returns as soon as the state flips.
 */
const defaultTransitionDurationMs = 1000;

/**
 * Driver for a dialog opened through the `MatDialog` service.
 *
 * The dialog container (`<mat-dialog-container role="dialog">`) is portaled
 * into the CDK overlay container on `document.body` — outside the test
 * engine's subtree — so this driver re-roots there
 * ({@link DialogDriver.overriddenParentLocator} + `'Same'`), the same portal
 * technique as the mui-v7 `DialogDriver`. The scene locator refines the
 * container element itself; MatDialog forwards no `data-testid`, so give the
 * dialog a stable `MatDialogConfig.id` (it lands on the container) and locate
 * it with `byAttribute('id', …)`.
 *
 * The driver assumes the default `role: 'dialog'`; a dialog opened with
 * `role: 'alertdialog'` needs its own locator arrangement.
 *
 * Dialog content is the consumer's own component — declare its parts through
 * the `ContainerDriver` `content` option; they resolve relative to the
 * container.
 */
export class DialogDriver<ContentT extends ScenePart> extends ContainerDriver<ContentT, typeof dialogParts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: dialogParts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return locatorUtil.append(overlayContainerLocator, byRole('dialog'));
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  /**
   * The dialog's title text, or `null` when it has none. Resolved through the
   * ARIA link Material maintains — the container's `aria-labelledby` names
   * the `mat-dialog-title` element's `id` (or whatever `ariaLabelledBy` the
   * dialog was configured with).
   */
  async getTitle(): Promise<string | null> {
    const labelledBy = await this.interactor.getAttribute(this.locator, 'aria-labelledby');
    if (labelledBy == null) {
      return null;
    }
    const titleLocator = byLinkedElement('Root')
      .onLinkedElement(this.locator)
      .extractAttribute('aria-labelledby')
      .toMatchMyAttribute('id');
    return (await this.interactor.getText(titleLocator))?.trim() ?? null;
  }

  /**
   * Dismiss the dialog by clicking its backdrop, then wait for it to close.
   *
   * The CDK dispatches `backdropClick` from a `click` on the backdrop
   * element; the click lands near the backdrop's top-left corner so real
   * (hit-tested) clicks stay clear of the centered dialog pane. Whether it
   * actually closes depends on the dialog's `disableClose`; the returned
   * boolean reflects the observed close, not merely the click.
   *
   * @param timeoutMs How long to wait for the close transition to finish
   * @returns true if the dialog closed
   */
  async closeByBackdropClick(timeoutMs: number = defaultTransitionDurationMs): Promise<boolean> {
    await this.enforcePartExistence('backdrop');
    await this.parts.backdrop.click({ position: { x: 5, y: 5 } });
    return this.waitForClose(timeoutMs);
  }

  /**
   * Dismiss the dialog by pressing `Escape`, then wait for it to close.
   *
   * The key is pressed on the dialog container and bubbles to the CDK's
   * document-level keyboard dispatcher — a code path distinct from
   * {@link closeByBackdropClick}. Whether it actually closes depends on the
   * dialog's `disableClose`; the returned boolean reflects the observed
   * close, not merely the key press.
   *
   * @param timeoutMs How long to wait for the close transition to finish
   * @returns true if the dialog closed
   */
  async closeByEscape(timeoutMs: number = defaultTransitionDurationMs): Promise<boolean> {
    await this.interactor.pressKey(this.locator, 'Escape');
    return this.waitForClose(timeoutMs);
  }

  /**
   * Wait for the dialog to open.
   * @param timeoutMs
   * @returns true if the dialog is open when the wait ends
   */
  async waitForOpen(timeoutMs: number = defaultTransitionDurationMs): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /**
   * Wait for the dialog to close.
   * @param timeoutMs
   * @returns true if the dialog is closed when the wait ends
   */
  async waitForClose(timeoutMs: number = defaultTransitionDurationMs): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  /**
   * Whether the dialog is open. Attachment is the open predicate: the CDK
   * removes the dialog's overlay from the DOM when it closes (there is no
   * hidden-but-attached state, unlike MUI's persistent modal root), and a
   * style probe would race the exit-animation detach. Around an open/close
   * action prefer {@link waitForOpen}/{@link waitForClose}, which absorb the
   * enter/exit animation.
   */
  isOpen(): Promise<boolean> {
    return this.exists();
  }

  override get driverName(): string {
    return 'AngularMaterialV22DialogDriver';
  }
}
