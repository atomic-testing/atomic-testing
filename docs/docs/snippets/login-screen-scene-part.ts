import { HTMLAnchorDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ButtonDriver, TextFieldDriver } from '@atomic-testing/component-driver-mui-v5';
import { ScenePart, byDataTestId } from '@atomic-testing/core';

const loginScenePart: ScenePart = {
  username: {
    locator: byDataTestId('username'),
    driver: TextFieldDriver,
  },
  password: {
    locator: byDataTestId('password'),
    driver: TextFieldDriver,
  },
  error: {
    locator: byDataTestId('error-display'),
    driver: HTMLElementDriver,
  },
  submit: {
    locator: byDataTestId('submit'),
    driver: ButtonDriver,
  },
  forgetPassword: {
    locator: byDataTestId('forget-password'),
    driver: HTMLAnchorDriver,
  },
} satisfies ScenePart;
