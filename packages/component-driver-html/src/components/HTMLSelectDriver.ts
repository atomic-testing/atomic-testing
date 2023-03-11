import { ComponentDriver, IInputDriver, Nullable } from '@atomic-testing/core';

type ValueT = string | readonly string[];

export class HTMLSelectDriver extends ComponentDriver<{}> implements IInputDriver<Nullable<ValueT>> {
  async getValue(): Promise<Nullable<ValueT>> {
    const multiple = await this.interactor.getAttribute(this.locator, 'multiple');
    const isMultiple = multiple != null;
    const values = await this.interactor.getSelectValues(this.locator);
    const returnedValue = isMultiple ? values : values?.[0];
    return returnedValue ?? null;
  }

  async setValue(value: Nullable<ValueT>): Promise<boolean> {
    let selectedValues: string[] = [];
    if (value != null) {
      selectedValues = Array.isArray(value) ? value : [value];
    }
    await this.interactor.selectOptionValue(this.locator, selectedValues);
    return true;
  }

  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  isReadonly(): Promise<boolean> {
    return this.interactor.isReadonly(this.locator);
  }

  get driverName(): string {
    throw 'HTMLSelectDriver';
  }
}
