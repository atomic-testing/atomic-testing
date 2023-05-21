import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  LocatorRelativePosition,
  PartLocator,
  ScenePart,
  byRole,
  byTagName,
} from '@atomic-testing/core';
import { MobileDatePickerDialogDriver } from './MobileDatePickerDialogDriver';

const parts = {
  inputTrigger: {
    locator: byTagName('input'),
    driver: HTMLTextInputDriver,
  },
  entryDialog: {
    locator: byRole('presentation', LocatorRelativePosition.Root).chain(byRole('dialog')),
    driver: MobileDatePickerDialogDriver,
  },
} satisfies ScenePart;

// dialog role=presentation, role=dialog
export class MobileDatePickerDriver extends ComponentDriver<typeof parts> implements IInputDriver<Date | null> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  protected async openEntryDialog(): Promise<void> {
    const isDialogVisible = await this.interactor.isVisible(this.parts.entryDialog.locator);
    if (isDialogVisible) {
      return;
    }
    await this.parts.inputTrigger.click();
    await this.parts.entryDialog.waitUntil({ condition: 'visible' });
  }

  protected async waitForEntryDialogClose(): Promise<void> {
    const isDialogVisible = await this.interactor.isVisible(this.parts.entryDialog.locator);
    if (!isDialogVisible) {
      return;
    }
    await this.parts.entryDialog.waitUntil({ condition: 'detached' });
  }

  async setValue(value: Date | null): Promise<boolean> {
    await this.openEntryDialog();
    const result = await this.parts.entryDialog.setValue(value);
    await this.waitForEntryDialogClose();
    return result;
  }

  async getValue(): Promise<Date | null> {
    await this.openEntryDialog();
    const result = await this.parts.entryDialog.getValue();
    await this.waitForEntryDialogClose();
    return result;
  }

  get driverName(): string {
    return 'MuiV5MobileDatePicker';
  }
}
