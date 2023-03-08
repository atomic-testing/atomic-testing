import { Page } from '@playwright/test';
import {
  IClickOption,
  IInteractor,
  LocatorChain,
  LocatorType,
  locatorUtil,
  Optional,
  PartLocatorType,
} from '@testzilla/core';
import { IEnterTextOption } from '@testzilla/core/src/types';

export class PlaywrightInteractor implements IInteractor {
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
    const optionLocator: PartLocatorType = {
      type: LocatorType.Css,
      selector: 'option:checked',
    };
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

  async enterText(locator: LocatorChain, text: string, option?: Partial<IEnterTextOption> | undefined): Promise<void> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    await this.page.locator(cssLocator).type(text);
  }

  async click(locator: LocatorChain, option?: IClickOption): Promise<void> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    await this.page.locator(cssLocator).click();
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

  clone(): IInteractor {
    return new PlaywrightInteractor(this.page);
  }
}
