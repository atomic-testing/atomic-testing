import { HTMLButtonDriver, HTMLTextInputDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, IExampleUIUnit, ScenePart } from '@atomic-testing/core';
import { SignupFormComponent } from './SignupForm.component';

export const signupFormExampleUI: IExampleUIUnit<typeof SignupFormComponent> = {
  title: 'SignupForm',
  ui: SignupFormComponent,
};

export const signupFormScene = {
  nameInput: { locator: byDataTestId('name'), driver: HTMLTextInputDriver },
  emailInput: { locator: byDataTestId('email'), driver: HTMLTextInputDriver },
  submitButton: { locator: byDataTestId('submit'), driver: HTMLButtonDriver },
  message: { locator: byDataTestId('message'), driver: HTMLElementDriver },
} satisfies ScenePart;

export const signupFormExample: IExampleUnit<typeof signupFormScene, typeof SignupFormComponent> = {
  ...signupFormExampleUI,
  scene: signupFormScene,
};
