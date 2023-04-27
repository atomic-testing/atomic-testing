import {
  byTagName,
  collectionUtil,
  ComponentDriver,
  IInputDriver,
  listHelper,
  locatorUtil,
  Nullable,
} from '@atomic-testing/core';

import { HTMLOptionDriver } from './HTMLOptionDriver';

type ValueT = string | readonly string[];
const optionLocator = byTagName('option');

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

  async getValuesByLabels(labels: readonly string[]): Promise<readonly string[]> {
    const labelSet = new Set(labels);
    const values: string[] = [];
    const itemLocatorBase = locatorUtil.append(this.locator, optionLocator);
    for await (const item of listHelper.getListItemIterator(this, itemLocatorBase, HTMLOptionDriver)) {
      const label = await item.label();
      const value = await item.value();
      if (label != null && labelSet.has(label) && value != null) {
        values.push(value);
      }
    }
    return values;
  }

  async selectByLabel(label: string | readonly string[]): Promise<void> {
    const labels = collectionUtil.toArray(label);
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
