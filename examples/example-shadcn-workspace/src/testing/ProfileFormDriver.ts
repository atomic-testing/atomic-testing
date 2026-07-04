import { HTMLButtonDriver, HTMLElementDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { SelectDriver } from '@atomic-testing/component-driver-shadcn-v1';
import {
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { ProfileSettingsDataTestId as T } from '../components/profileSettings/ProfileSettingsDataTestId';

/** A (partial) profile edit. `timezone` is the option's VISIBLE LABEL — see {@link SelectDriver}. */
export interface ProfileDraft {
  displayName?: string;
  timezone?: string;
}

/** Read-back of the form. `timezone` is the selected option's visible label. */
export interface ProfileSnapshot {
  displayName: string | null;
  timezone: string | null;
}

/**
 * The profile form composed into one page object: the display-name `Input`
 * (plain HTML driver — shadcn's Input is a styled `<input>`), the timezone
 * `Select` (the shipped shadcn `SelectDriver`, label-based since Radix renders
 * no `data-value`), the Save button, and the save-confirmation line. Tests
 * read "fill the form and save" instead of walking individual controls.
 */
const parts = {
  displayName: { locator: byDataTestId(T.displayNameInput), driver: HTMLTextInputDriver },
  timezone: { locator: byDataTestId(T.timezoneSelect), driver: SelectDriver },
  save: { locator: byDataTestId(T.saveButton), driver: HTMLButtonDriver },
  saveStatus: { locator: byDataTestId(T.saveStatus), driver: HTMLElementDriver },
} satisfies ScenePart;

export class ProfileFormDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  /** Apply a (partial) profile draft. */
  async setValue(draft: ProfileDraft): Promise<void> {
    if (draft.displayName !== undefined) {
      await this.parts.displayName.setValue(draft.displayName);
    }
    if (draft.timezone !== undefined) {
      await this.parts.timezone.selectByLabel(draft.timezone);
    }
  }

  /** Read the form back. */
  async getValue(): Promise<ProfileSnapshot> {
    return {
      displayName: await this.parts.displayName.getValue(),
      timezone: await this.parts.timezone.getSelectedLabel(),
    };
  }

  async save(): Promise<void> {
    await this.parts.save.click();
  }

  /** The save-confirmation text, or `null` before the first save. */
  async getSaveStatus(): Promise<string | null> {
    if (!(await this.interactor.exists(this.parts.saveStatus.locator))) {
      return null;
    }
    return (await this.parts.saveStatus.getText())?.trim() ?? null;
  }

  get timezone(): SelectDriver {
    return this.parts.timezone;
  }

  get driverName(): string {
    return 'ProfileFormDriver';
  }
}
