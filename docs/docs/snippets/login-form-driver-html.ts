import { HTMLButtonDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  ComponentDriver,
  Interactor,
  IComponentDriverOption,
  IInputDriver,
  PartLocator,
  ScenePart,
  byDataTestId,
} from '@atomic-testing/core';

const parts = {
  username: { locator: byDataTestId('username'), driver: HTMLTextInputDriver },
  submit: { locator: byDataTestId('submit'), driver: HTMLButtonDriver },
} satisfies ScenePart;

export interface LoginCredential {
  username: string;
}

export class LoginFormDriver extends ComponentDriver<typeof parts> implements IInputDriver<LoginCredential> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  async getValue(): Promise<LoginCredential> {
    return { username: (await this.parts.username.getValue()) ?? '' };
  }

  async setValue(value: LoginCredential): Promise<boolean> {
    await this.parts.username.setValue(value.username);
    return true;
  }

  async login(value: LoginCredential): Promise<void> {
    await this.setValue(value);
    await this.parts.submit.click();
  }

  get driverName(): string {
    return 'LoginFormDriver';
  }
}
