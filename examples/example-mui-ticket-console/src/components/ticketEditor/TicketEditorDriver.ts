import {
  AutoCompleteDriver,
  ButtonDriver,
  ChipDriver,
  SelectDriver,
  SwitchDriver,
  TextFieldDriver,
} from '@atomic-testing/component-driver-mui-v9';
import { DesktopDatePickerDriver } from '@atomic-testing/component-driver-mui-x-v9';
import {
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  locatorUtil,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import type { TicketEdit } from '../../models/Ticket';
import { labelChipTestId, TicketEditorDataTestId as TID } from './TicketEditorDataTestId';

const parts = {
  title: { locator: byDataTestId(TID.title), driver: TextFieldDriver },
  status: { locator: byDataTestId(TID.status), driver: SelectDriver },
  priority: { locator: byDataTestId(TID.priority), driver: SelectDriver },
  assignee: { locator: byDataTestId(TID.assignee), driver: AutoCompleteDriver },
  watching: { locator: byDataTestId(TID.watching), driver: SwitchDriver },
  due: { locator: byDataTestId(TID.due), driver: DesktopDatePickerDriver },
  save: { locator: byDataTestId(TID.save), driver: ButtonDriver },
  cancel: { locator: byDataTestId(TID.cancel), driver: ButtonDriver },
} satisfies ScenePart;

export interface EditorValue {
  title: string;
  status: string | null;
  priority: string | null;
  assignee: string | null;
  watching: boolean;
  due: Optional<string>;
}

// Page-object driver for the editor dialog. Its locator is the (portaled) dialog root; the field
// drivers compose under it. Reads "open" from the dialog's presence — MUI unmounts a closed dialog.
export class TicketEditorDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  async isOpen(): Promise<boolean> {
    return this.interactor.exists(this.locator);
  }

  async waitForOpen(timeoutMs: number = 5000): Promise<void> {
    await this.waitUntil({ probeFn: () => this.isOpen(), terminateCondition: true, timeoutMs });
  }

  async waitForClose(timeoutMs: number = 5000): Promise<void> {
    await this.waitUntil({ probeFn: () => this.isOpen(), terminateCondition: false, timeoutMs });
  }

  /** Apply the provided fields. Omitted fields are left untouched. */
  async setValue(edit: Partial<TicketEdit>): Promise<void> {
    if (edit.title !== undefined) {
      await this.parts.title.setValue(edit.title);
    }
    if (edit.status !== undefined) {
      await this.parts.status.selectByLabel(edit.status);
    }
    if (edit.priority !== undefined) {
      await this.parts.priority.selectByLabel(edit.priority);
    }
    if (edit.assignee !== undefined) {
      await this.parts.assignee.setValue(edit.assignee);
    }
    if (edit.watching !== undefined) {
      await this.parts.watching.setSelected(edit.watching);
    }
    if (edit.due !== undefined) {
      await this.parts.due.pickDate(edit.due);
    }
  }

  async getValue(): Promise<EditorValue> {
    const [title, status, priority, assignee, watching, due] = await Promise.all([
      this.parts.title.getValue(),
      this.parts.status.getSelectedLabel(),
      this.parts.priority.getSelectedLabel(),
      this.parts.assignee.getValue(),
      this.parts.watching.isSelected(),
      this.parts.due.getValueText(),
    ]);
    return { title: title ?? '', status, priority, assignee, watching, due };
  }

  /** The title field's validation message, e.g. after attempting to save an empty title. */
  async getError(): Promise<Optional<string>> {
    return this.parts.title.getHelperText();
  }

  /** A ChipDriver for one label chip, addressed by the label text. */
  getLabelChip(label: string): ChipDriver {
    return new ChipDriver(
      locatorUtil.append(this.locator, byDataTestId(labelChipTestId(label))),
      this.interactor,
      this.commutableOption
    );
  }

  async removeLabel(label: string): Promise<void> {
    await this.getLabelChip(label).clickRemove();
  }

  async save(): Promise<void> {
    await this.parts.save.click();
  }

  async cancel(): Promise<void> {
    await this.parts.cancel.click();
  }

  override get driverName(): string {
    return 'TicketEditorDriver';
  }
}
