import { AutoCompleteDriver, SelectDriver, TextFieldDriver } from '@atomic-testing/component-driver-mui-v9';
import { DesktopDatePickerDriver } from '@atomic-testing/component-driver-mui-x-v9';
import {
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { FilterBarDataTestId } from './FilterBarDataTestId';

const parts = {
  search: { locator: byDataTestId(FilterBarDataTestId.search), driver: TextFieldDriver },
  assignee: { locator: byDataTestId(FilterBarDataTestId.assignee), driver: AutoCompleteDriver },
  status: { locator: byDataTestId(FilterBarDataTestId.status), driver: SelectDriver },
  dueFrom: { locator: byDataTestId(FilterBarDataTestId.dueFrom), driver: DesktopDatePickerDriver },
  dueTo: { locator: byDataTestId(FilterBarDataTestId.dueTo), driver: DesktopDatePickerDriver },
} satisfies ScenePart;

export interface ActiveFilters {
  search: string;
  assignee: string | null;
  status: string | null;
  dueFrom: string | undefined;
  dueTo: string | undefined;
}

// Page-object driver for the filter bar. Composes the shipped text/autocomplete/select/date-picker
// drivers — including the new DesktopDatePicker `pickDate` — behind triage-oriented method names.
export class FilterBarDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  async search(text: string): Promise<void> {
    await this.parts.search.setValue(text);
  }

  async filterByAssignee(name: string): Promise<void> {
    await this.parts.assignee.setValue(name);
  }

  async filterByStatus(label: string): Promise<void> {
    await this.parts.status.selectByLabel(label);
  }

  /** Set the due-date range by operating both desktop date pickers. Dates are `yyyy-mm-dd`. */
  async setDueRange(fromIso: string, toIso: string): Promise<void> {
    await this.parts.dueFrom.pickDate(fromIso);
    await this.parts.dueTo.pickDate(toIso);
  }

  async getActiveFilters(): Promise<ActiveFilters> {
    const [search, assignee, status, dueFrom, dueTo] = await Promise.all([
      this.parts.search.getValue(),
      this.parts.assignee.getValue(),
      this.parts.status.getSelectedLabel(),
      this.parts.dueFrom.getValueText(),
      this.parts.dueTo.getValueText(),
    ]);
    return { search: search ?? '', assignee, status, dueFrom, dueTo };
  }

  override get driverName(): string {
    return 'FilterBarDriver';
  }
}
