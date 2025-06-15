import { TextFieldDriver, ButtonDriver } from '@atomic-testing/component-driver-mui-v5';
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
  username: { locator: byDataTestId('username'), driver: TextFieldDriver },
  password: { locator: byDataTestId('password'), driver: TextFieldDriver },
  submit: { locator: byDataTestId('submit'), driver: ButtonDriver },
} satisfies ScenePart;

export interface LoginCredential {
  username: string;
  password: string;
}

export class LoginFormDriver extends ComponentDriver<typeof parts> implements IInputDriver<LoginCredential> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  async setValue(value: LoginCredential): Promise<boolean> {
    await this.parts.username.setValue(value.username);
    await this.parts.password.setValue(value.password);
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
