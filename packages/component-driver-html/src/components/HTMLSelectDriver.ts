import {
  ComponentDriver,
  IInputDriver,
  LocatorType,
  locatorUtil,
  Nullable,
  PartLocatorType,
} from '@atomic-testing/core';

import { HTMLOptionDriver } from './HTMLOptionDriver';

type ValueT = string | readonly string[];

export class HTMLSelectDriver extends ComponentDriver<{}> implements IInputDriver<Nullable<ValueT>> {
  async isMultiple(): Promise<boolean> {
    const multiple = await this.interactor.getAttribute(this.locator, 'multiple');
    return multiple != null;
  }

  async getValue(): Promise<Nullable<ValueT>> {
    const isMultiple = await this.isMultiple();
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

  async getOptionByLocator(itemLocator: PartLocatorType): Promise<HTMLOptionDriver | null> {
    const locator = locatorUtil.append(this.locator, itemLocator);
    const exists = await this.interactor.exists(locator);
    if (exists) {
      return new HTMLOptionDriver(locator, this.interactor);
    } else {
      return null;
    }
  }

  async getOptionByIndex(index: number): Promise<HTMLOptionDriver | null> {
    const itemLocator: PartLocatorType = {
      type: LocatorType.Css,
      selector: `option:nth-of-type(${index + 1})`,
    };
    return this.getOptionByLocator(itemLocator);
  }

  async getValuesByLabels(labels: readonly string[]): Promise<readonly string[]> {
    const labelSet = new Set(labels);
    let index = 0;
    let item: HTMLOptionDriver | null = await this.getOptionByIndex(index);
    const values: string[] = [];
    while (item != null) {
      const label = await item.label();
      const value = await item.value();
      if (label != null && labelSet.has(label) && value != null) {
        values.push(value);
      }
      index++;
      item = await this.getOptionByIndex(index);
    }
    return values;
  }

  async selectByLabel(label: string | readonly string[]): Promise<void> {
    const labels = Array.isArray(label) ? label : [label];
    const values = await this.getValuesByLabels(labels);
    await this.setValue(values);
  }

  async getSelectedLabel(isMultiple: true): Promise<readonly string[] | null>;
  async getSelectedLabel(isMultiple: false): Promise<string | null>;
  async getSelectedLabel(): Promise<string | null>;
  async getSelectedLabel(isMultiple?: boolean) {
    if (await this.exists()) {
      const labels = await this.interactor.getSelectLabels(this.locator);
      if (isMultiple) {
        return labels;
      }
      return labels![0] ?? null;
    }
    return null;
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
