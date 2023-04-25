import {
  byCssSelector,
  ClickOption,
  CssProperty,
  EnterTextOption,
  Interactor,
  LocatorChain,
  locatorUtil,
  Optional,
  PartLocatorType,
  timingUtil,
} from '@atomic-testing/core';
import { Page } from '@playwright/test';

export class PlaywrightInteractor implements Interactor {
  constructor(public readonly page: Page) {}

  async selectOptionValue(locator: LocatorChain, values: string[]): Promise<void> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    await this.page.locator(cssLocator).selectOption(values);
  }

  async getInputValue(locator: LocatorChain): Promise<Optional<string>> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    return this.page.locator(cssLocator).inputValue();
  }

  async getSelectValues(locator: LocatorChain): Promise<Optional<readonly string[]>> {
    const optionLocator: PartLocatorType = byCssSelector('option:checked');
    const selectedOptionLocator = locatorUtil.append(locator, optionLocator);
    const cssLocator = locatorUtil.toCssSelector(selectedOptionLocator);
    const allOptions = await this.page.locator(cssLocator).all();
    const values: string[] = [];
    for (const option of allOptions) {
      const value = await option.getAttribute('value');
      if (value != null) {
        values.push(value);
      }
    }
    return values;
  }

  async getSelectLabels(locator: LocatorChain): Promise<Optional<readonly string[]>> {
    const optionLocator: PartLocatorType = byCssSelector('option:checked');
    const selectedOptionLocator = locatorUtil.append(locator, optionLocator);
    const cssLocator = locatorUtil.toCssSelector(selectedOptionLocator);
    const allOptions = await this.page.locator(cssLocator).all();
    const labels: string[] = [];
    for (const option of allOptions) {
      const label = await option.textContent();
      if (label != null) {
        labels.push(label);
      }
    }
    return labels;
  }

  async getStyleValue(locator: LocatorChain, propertyName: CssProperty): Promise<Optional<string>> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    const elLocator = this.page.locator(cssLocator);
    const value = await elLocator.evaluate((element, prop) => {
      return window.getComputedStyle(element).getPropertyValue(prop as string);
    }, propertyName);
    return value;
  }

  async enterText(locator: LocatorChain, text: string, option?: Optional<Partial<EnterTextOption>>): Promise<void> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    if (!option?.append) {
      await this.page.locator(cssLocator).clear();
    }
    await this.page.locator(cssLocator).type(text);
  }

  async click(locator: LocatorChain, option?: ClickOption): Promise<void> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    await this.page.locator(cssLocator).click();
  }

  async hover(locator: LocatorChain): Promise<void> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    await this.page.locator(cssLocator).hover();
  }

  wait(ms: number): Promise<void> {
    return timingUtil.wait(ms);
  }

  async getAttribute(locator: LocatorChain, name: string, isMultiple: true): Promise<readonly string[]>;
  async getAttribute(locator: LocatorChain, name: string, isMultiple: false): Promise<Optional<string>>;
  async getAttribute(locator: LocatorChain, name: string): Promise<Optional<string>>;
  async getAttribute(
    locator: LocatorChain,
    name: string,
    isMultiple?: boolean,
  ): Promise<Optional<string> | readonly string[]> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    const elLocator = this.page.locator(cssLocator);
    if (isMultiple) {
      const locators = await elLocator.all();
      const values: string[] = [];
      for (const locator of locators) {
        const value = await locator.getAttribute(name);
        if (value != null) {
          values.push(value);
        }
      }
      return values;
    }
    const value = await elLocator.getAttribute(name);
    return value ?? undefined;
  }

  async getText(locator: LocatorChain): Promise<Optional<string>> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    const text = await this.page.locator(cssLocator).textContent();
    return text ?? undefined;
  }

  async exists(locator: LocatorChain): Promise<boolean> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    const count = await this.page.locator(cssLocator).count();
    return count > 0;
  }

  async isChecked(locator: LocatorChain): Promise<boolean> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    const checked = await this.page.locator(cssLocator).isChecked();
    return checked;
  }

  async isDisabled(locator: LocatorChain): Promise<boolean> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    const isDisabled = await this.page.locator(cssLocator).isDisabled();
    return isDisabled;
  }

  async isReadonly(locator: LocatorChain): Promise<boolean> {
    const readonly = await this.getAttribute(locator, 'readonly');
    return readonly != null;
  }

  async isVisible(locator: LocatorChain): Promise<boolean> {
    const exists = await this.exists(locator);
    if (!exists) {
      return false;
    }

    const opacity = await this.getStyleValue(locator, 'opacity');
    if (opacity === '0') {
      return false;
    }

    const visibility = await this.getStyleValue(locator, 'visibility');
    if (visibility === 'hidden') {
      return false;
    }

    const display = await this.getStyleValue(locator, 'display');
    if (display === 'none') {
      return false;
    }

    return true;
  }

  async hasCssClass(locator: LocatorChain, className: string): Promise<boolean> {
    const classNames = await this.getAttribute(locator, 'class');
    if (classNames == null) {
      return false;
    }

    const names = classNames.split(/\s+/);
    return names.includes(className);
  }

  async hasAttribute(locator: LocatorChain, name: string): Promise<boolean> {
    const attrValue = await this.getAttribute(locator, name);
    return attrValue != null;
  }

  clone(): Interactor {
    return new PlaywrightInteractor(this.page);
  }
}
