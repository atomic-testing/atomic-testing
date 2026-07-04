import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { DialogDriver } from '@atomic-testing/component-driver-shadcn-v1';
import {
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { ProfileSettingsDataTestId as T } from '../components/profileSettings/ProfileSettingsDataTestId';

/**
 * The confirm dialog's own buttons, declared as the `DialogDriver`'s `content`
 * scene — they only exist while the (portalled) dialog is mounted, so they are
 * scoped inside the re-rooted `role="dialog"` content rather than the page.
 */
const confirmDialogContent = {
  cancel: { locator: byDataTestId(T.deleteCancel), driver: HTMLButtonDriver },
  confirm: { locator: byDataTestId(T.deleteConfirm), driver: HTMLButtonDriver },
} satisfies ScenePart;

/**
 * The destructive "Delete workspace" flow composed into one page object: the
 * trigger button, the confirm `Dialog` (the shipped shadcn `DialogDriver`
 * re-roots itself at `role="dialog"` on `document.body`), and the visible
 * workspace-status line. Note there is deliberately no backdrop-click close:
 * Radix's `Dialog.Overlay` carries no distinguishing ARIA, so `closeByEscape`
 * is the portable dismissal the driver ships (see the Radix driver coverage doc).
 */
const parts = {
  deleteTrigger: { locator: byDataTestId(T.deleteTrigger), driver: HTMLButtonDriver },
  dialog: {
    locator: byDataTestId(T.deleteDialog),
    driver: DialogDriver<typeof confirmDialogContent>,
    option: { content: confirmDialogContent },
  },
  status: { locator: byDataTestId(T.workspaceStatus), driver: HTMLElementDriver },
} satisfies ScenePart;

export class DangerZoneDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  /** Open the confirm dialog and wait for its content to mount. */
  async openDialog(): Promise<void> {
    await this.parts.deleteTrigger.click();
    await this.parts.dialog.waitForOpen();
  }

  /** Click Cancel and wait for the dialog to close. */
  async cancel(): Promise<void> {
    await this.parts.dialog.content.cancel.click();
    await this.parts.dialog.waitForClose();
  }

  /** Click the destructive confirm and wait for the dialog to close. */
  async confirmDelete(): Promise<void> {
    await this.parts.dialog.content.confirm.click();
    await this.parts.dialog.waitForClose();
  }

  /** The visible workspace state ("Workspace active" / "Workspace deleted"). */
  async getWorkspaceStatus(): Promise<string | null> {
    return (await this.parts.status.getText())?.trim() ?? null;
  }

  get dialog(): DialogDriver<typeof confirmDialogContent> {
    return this.parts.dialog;
  }

  get driverName(): string {
    return 'DangerZoneDriver';
  }
}
