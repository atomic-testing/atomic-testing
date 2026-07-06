import { TabsDriver } from '@atomic-testing/component-driver-shadcn-v1';
import {
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { AppDataTestId } from '../AppDataTestId';
import { ProfileSettingsDataTestId } from '../components/profileSettings/ProfileSettingsDataTestId';
import { WorkspaceHeaderDataTestId } from '../components/workspaceHeader/WorkspaceHeaderDataTestId';
import { AccountMenuDriver } from './AccountMenuDriver';
import { DangerZoneDriver } from './DangerZoneDriver';
import { ProfileFormDriver } from './ProfileFormDriver';

/**
 * The top-level page object: header menu + settings tabs + profile form +
 * danger zone composed into one, so an entire flow reads through a single
 * object — `workspace.account.choose('Sign out')`, `workspace.profile.save()`.
 * This driver (and {@link workspaceParts}) is imported verbatim by both the
 * Vitest DOM specs and the Playwright E2E specs; only the engine construction
 * differs.
 */
const parts = {
  account: { locator: byDataTestId(WorkspaceHeaderDataTestId.root), driver: AccountMenuDriver },
  tabs: { locator: byDataTestId(AppDataTestId.settingsTabs), driver: TabsDriver },
  profile: { locator: byDataTestId(ProfileSettingsDataTestId.form), driver: ProfileFormDriver },
  danger: { locator: byDataTestId(ProfileSettingsDataTestId.dangerZone), driver: DangerZoneDriver },
} satisfies ScenePart;

export class WorkspaceDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  get account(): AccountMenuDriver {
    return this.parts.account;
  }

  get tabs(): TabsDriver {
    return this.parts.tabs;
  }

  get profile(): ProfileFormDriver {
    return this.parts.profile;
  }

  get danger(): DangerZoneDriver {
    return this.parts.danger;
  }

  get driverName(): string {
    return 'WorkspaceDriver';
  }
}
