import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
  title: {
    locator: byCssClass('MuiDialogTitle-root'),
    driver: HTMLElementDriver,
  },
  dialogContainer: {
    locator: byRole('presentation'),
    driver: HTMLElementDriver,
  },
  /**
   * The dialog surface — the `role="dialog"` element holding the caller's
   * `DialogTitle`/`DialogContent`/`DialogActions`. Anchors {@link DialogDriver.interiorLocator}.
   */
  paper: {
    locator: byCssClass('MuiDialog-paper'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

const dialogRootLocator: PartLocator = byRole('presentation', 'Root');

const defaultTransitionDuration = 250;
const closeGraceMs = 150;

export class DialogDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: parts,
    });
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return dialogRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  /**
   * Interiors resolve against the dialog surface, not this driver's own locator.
   * That locator is the portal-rendered Modal root, whose direct children are the
   * backdrop and MUI's two focus-trap sentinels — so an un-narrowed interior
   * reaches MUI chrome the scene never wrote. The paper is the tightest element
   * still containing every caller slot (title, content AND actions).
   */
  protected override get interiorLocator(): PartLocator {
    return this.parts.paper.locator;
  }

  async getTitle(): Promise<string | null> {
    await this.enforcePartExistence('title');
    const title = await this.parts.title.getText();
    return title ?? null;
  }

  /**
   * Dismiss the dialog by clicking outside its content, then wait for it to close.
   *
   * MUI's "backdrop click" is handled on the `.MuiDialog-container` surface (which
   * overlays the visual `.MuiBackdrop-root`), firing `onClose` only when the click
   * target is the container itself. The click therefore lands on the container near
   * its top-left corner to avoid the centered paper. Whether it actually closes
   * depends on the consumer's `onClose` handling (MUI reports a `"backdropClick"`
   * reason); the returned boolean reflects the observed close, not merely the click.
   *
   * @param timeoutMs How long to wait for the close transition to finish
   * @returns true if the dialog closed
   */
  async closeByBackdropClick(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    await this.enforcePartExistence('dialogContainer');
    // MUI only dismisses when the same element receives mousedown and click, so
    // drive the full press/release/click sequence on the container's empty corner
    // (the click target must be the container, not the centered paper).
    const cornerClick = { position: { x: 5, y: 5 } } as const;
    // Raw press/release primitives are protected on ComponentDriver (#1045), so
    // drive them through the interactor against the child's resolved locator.
    const containerLocator = this.parts.dialogContainer.locator;
    await this.interactor.mouseDown(containerLocator, cornerClick);
    await this.interactor.mouseUp(containerLocator, cornerClick);
    await this.parts.dialogContainer.click(cornerClick);
    return this.waitForClose(timeoutMs);
  }

  /**
   * Wait for dialog to open
   * @param timeoutMs
   * @returns true open has performed successfully
   */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /**
   * Wait for dialog to close. Polls for up to `timeoutMs`, then allows a further
   * `closeGraceMs` grace period for a real transition timer that's merely running
   * late before giving up (see the fallback below).
   * @param timeoutMs
   * @returns true once the dialog has closed, within `timeoutMs` plus the grace period.
   */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    if (isOpened === false) {
      return true;
    }
    // Under React's act() the close transition can commit only when the polling
    // act block exits, so the loop above can still observe the dialog as open
    // even though the real exit-transition timer is merely running late (e.g. a
    // contended CI runner) rather than genuinely stuck. A short, act()-wrapped
    // grace-period recheck gives that timer real wall-clock time to fire before
    // giving up (mirrors OverlayDriver.waitForClose's fallback).
    const settled = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs: closeGraceMs,
    });
    return settled === false;
  }

  /**
   * Check if the dialog box is open.  Caution, because of animation, upon an open/close action is performed
   * use waitForOpen() or waitForClose() before using isOpen() would result a more accurate open state of the dialog
   * @returns true if dialog box is open
   */
  async isOpen(): Promise<boolean> {
    const exists = await this.exists();
    if (!exists) {
      return false;
    }
    const isVisible = await this.interactor.isVisible(this.parts.dialogContainer.locator);
    return isVisible;
  }

  get driverName(): string {
    return 'MuiV9DialogDriver';
  }
}
