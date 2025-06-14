import { ButtonDriver, TextFieldDriver } from '@atomic-testing/component-driver-mui-v5';
import { ComponentDriver, Locator, Interactor } from '@atomic-testing/core';
import { byDataTestId, ScenePart } from '@atomic-testing/core';

export const loginFormParts = {
  username: {
    locator: byDataTestId('username'),
    driver: TextFieldDriver,
  },
  password: {
    locator: byDataTestId('password'),
    driver: TextFieldDriver,
  },
  submit: {
    locator: byDataTestId('submit'),
    driver: ButtonDriver,
  },
} satisfies ScenePart;

export class LoginFormDriver extends ComponentDriver<typeof loginFormParts> {
  constructor(locator: Locator, interactor: Interactor) {
    super(locator, interactor, { parts: loginFormParts });
  }

  async login(credentials: { username: string; password: string }): Promise<void> {
    await this.parts.username.setValue(credentials.username);
    await this.parts.password.setValue(credentials.password);
    await this.parts.submit.click();
  }

  get driverName(): string {
    return 'LoginFormDriver';
  }
}
