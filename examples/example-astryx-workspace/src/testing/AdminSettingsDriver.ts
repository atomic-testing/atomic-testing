import {
  AlertDialogDriver,
  BannerDriver,
  ButtonDriver,
  CheckboxListDriver,
  DateInputDriver,
  FieldDriver,
  RadioListDriver,
  SegmentedControlDriver,
  SelectorDriver,
  SwitchDriver,
  TabListDriver,
  TextInputDriver,
  ToastDriver,
} from '@atomic-testing/component-driver-astryx';
import {
  byAriaLabel,
  byCssSelector,
  byDataTestId,
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  locatorUtil,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { AdminSettingsDataTestId as T, PLAN_LABEL } from '../components/adminSettings/AdminSettingsDataTestId';
import { SettingsModel } from '../models/SettingsModel';

/** Read-back of the form. `renewal` is the DateInput's displayed string, not ISO. */
export interface AdminSettingsSnapshot {
  orgName: string | null;
  plan: string | null;
  channels: string[];
  density: string | null;
  beta: boolean;
  model: Optional<string>;
  renewal: Optional<string>;
}

/**
 * Composes the entire settings form into one page object. `setValue` drives each
 * control through its shipped driver, switching tabs as needed — so the test reads as
 * "fill the form and save", and the tab choreography stays here. SegmentedControl and
 * Switch forward no testid, so they are anchored by role (+ accessible name).
 */
const parts = {
  tabs: { locator: byDataTestId(T.tabs), driver: TabListDriver },
  orgField: { locator: byDataTestId(T.orgField), driver: FieldDriver },
  orgInput: { locator: byDataTestId(T.orgInput), driver: TextInputDriver },
  plan: { locator: locatorUtil.append(byRole('radiogroup'), byAriaLabel(PLAN_LABEL, 'Same')), driver: SegmentedControlDriver },
  channels: { locator: byDataTestId(T.channels), driver: CheckboxListDriver },
  density: { locator: byDataTestId(T.density), driver: RadioListDriver },
  beta: { locator: locatorUtil.append(byDataTestId(T.betaField), byRole('switch')), driver: SwitchDriver },
  model: { locator: byDataTestId(T.model), driver: SelectorDriver },
  renewal: { locator: byDataTestId(T.renewal), driver: DateInputDriver },
  unsavedBanner: { locator: byDataTestId(T.unsavedBanner), driver: BannerDriver },
  save: { locator: byDataTestId(T.save), driver: ButtonDriver },
  deleteTrigger: { locator: byDataTestId(T.deleteTrigger), driver: ButtonDriver },
  deleteDialog: { locator: byDataTestId(T.deleteDialog), driver: AlertDialogDriver },
  toast: { locator: byCssSelector('.astryx-toast'), driver: ToastDriver },
} satisfies ScenePart;

export class AdminSettingsDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  /** Apply a (partial) settings draft, switching tabs to reach each control. */
  async setValue(value: Partial<SettingsModel>): Promise<void> {
    if (value.orgName !== undefined || value.plan !== undefined || value.renewal !== undefined) {
      await this.parts.tabs.selectTab('General');
      if (value.orgName !== undefined) {
        await this.parts.orgInput.setValue(value.orgName);
      }
      if (value.plan !== undefined) {
        await this.parts.plan.setValue(value.plan);
      }
      if (value.renewal !== undefined) {
        await this.parts.renewal.pickDate(value.renewal);
      }
    }

    if (value.channels !== undefined) {
      await this.parts.tabs.selectTab('Notifications');
      const checked = await this.parts.channels.getCheckedLabels();
      for (const label of checked) {
        if (!value.channels.includes(label)) {
          await this.parts.channels.uncheckItemByLabel(label);
        }
      }
      for (const label of value.channels) {
        await this.parts.channels.checkItemByLabel(label);
      }
    }

    if (value.density !== undefined || value.beta !== undefined || value.model !== undefined) {
      await this.parts.tabs.selectTab('Appearance');
      if (value.density !== undefined) {
        await this.parts.density.selectByValue(value.density);
      }
      if (value.beta !== undefined) {
        await (value.beta ? this.parts.beta.turnOn() : this.parts.beta.turnOff());
      }
      if (value.model !== undefined) {
        await this.parts.model.selectByLabel(value.model);
      }
    }
  }

  /** Read the form back, tab by tab. `renewal` is the displayed date string. */
  async getValue(): Promise<AdminSettingsSnapshot> {
    await this.parts.tabs.selectTab('General');
    const orgName = await this.parts.orgInput.getValue();
    const plan = await this.parts.plan.getValue();
    const renewal = await this.parts.renewal.getValue();

    await this.parts.tabs.selectTab('Notifications');
    const channels = await this.parts.channels.getCheckedLabels();

    await this.parts.tabs.selectTab('Appearance');
    const density = await this.parts.density.getValue();
    const beta = await this.parts.beta.isOn();
    const model = await this.parts.model.getSelectedLabel();

    return { orgName, plan, channels, density, beta, model, renewal };
  }

  async save(): Promise<void> {
    await this.parts.save.click();
  }

  /** Whether the unsaved-changes banner is showing. */
  async hasUnsavedBanner(): Promise<boolean> {
    return this.interactor.exists(this.parts.unsavedBanner.locator);
  }

  /** The save-confirmation toast message, or `undefined` when no toast is shown. */
  async getToastMessage(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(this.parts.toast.locator))) {
      return undefined;
    }
    return this.parts.toast.getMessage();
  }

  async openDeleteDialog(): Promise<void> {
    await this.parts.deleteTrigger.click();
  }

  /** Open the delete dialog and either confirm (action) or cancel. */
  async deleteWorkspace(confirm: boolean): Promise<void> {
    await this.openDeleteDialog();
    await (confirm ? this.parts.deleteDialog.clickAction() : this.parts.deleteDialog.clickCancel());
  }

  get tabs(): TabListDriver {
    return this.parts.tabs;
  }

  get orgField(): FieldDriver {
    return this.parts.orgField;
  }

  get deleteDialog(): AlertDialogDriver {
    return this.parts.deleteDialog;
  }

  get driverName(): string {
    return 'AdminSettingsDriver';
  }
}
