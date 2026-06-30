import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  byRole,
  ContainerDriver,
  IContainerDriverOption,
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
} satisfies ScenePart;

const dialogRootLocator: PartLocator = byRole('presentation', 'Root');

const defaultTransitionDuration = 250;

export class DialogDriver<ContentT extends ScenePart> extends ContainerDriver<ContentT, typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: parts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return dialogRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
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
    await this.parts.dialogContainer.mouseDown(cornerClick);
    await this.parts.dialogContainer.mouseUp(cornerClick);
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
   * Wait for dialog to close
   * @param timeoutMs
   * @returns true open has performed successfully
   */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
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
