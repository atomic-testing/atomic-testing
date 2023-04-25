import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  byTagName,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
  input: {
    locator: byTagName('input'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export class AutoCompleteDriver extends ComponentDriver<typeof parts> implements IInputDriver<string | null> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  getValue(): Promise<string | null> {
    throw new Error('Method not implemented.');
  }

  setValue(value: string | null): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  isDisabled(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  isReadonly(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  get driverName(): string {
    return 'MuiV5AutoCompleteDriver';
  }
}
