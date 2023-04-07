import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  byRole,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  LocatorChain,
  LocatorRelativePosition,
  Optional,
  PartLocatorType,
  ScenePart,
  timingUtil,
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

const dialogRootLocator: PartLocatorType = byRole('presentation', LocatorRelativePosition.Root);

const defaultTransitionDuration = 250;

export class DialogDriver<ContentT extends ScenePart> extends ContainerDriver<ContentT, typeof parts> {
  constructor(locator: LocatorChain, interactor: Interactor, option?: Partial<IContainerDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: parts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  override overriddenParentLocator(): Optional<LocatorChain> {
    return [dialogRootLocator];
  }

  override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return LocatorRelativePosition.Same;
  }

  async getTitle(): Promise<string | null> {
    await this.enforcePartExistence('title');
    const title = await this.parts.title.getText();
    return title ?? null;
  }

  /**
   * Wait for dialog to open
   * @param timeoutMs
   * @returns true open has performed successfully
   */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await timingUtil.waitUntil(this.isOpen.bind(this), true, timeoutMs);
    return isOpened === true;
  }

  /**
   * Wait for dialog to close
   * @param timeoutMs
   * @returns true open has performed successfully
   */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await timingUtil.waitUntil(this.isOpen.bind(this), false, timeoutMs);
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
    return 'MuiV5DialogDriver';
  }
}
