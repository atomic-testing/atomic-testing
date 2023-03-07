import { Page } from '@playwright/test';
import { IClickOption, IInteractor, LocatorChain, locatorUtil, Optional } from '@testzilla/core';
import { IEnterTextOption } from '@testzilla/core/src/types';

export class PlaywrightInteractor implements IInteractor {
  constructor(public readonly page: Page) {}
  async getInputValue(locator: LocatorChain): Promise<Optional<string>> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    console.log(cssLocator);
    return this.page.locator(cssLocator).inputValue();
  }

  async enterText(locator: LocatorChain, text: string, option?: Partial<IEnterTextOption> | undefined): Promise<void> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    await this.page.locator(cssLocator).type(text);
  }

  async click(locator: LocatorChain, option?: IClickOption): Promise<void> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    await this.page.locator(cssLocator).click();
  }

  async getAttribute(locator: LocatorChain): Promise<Optional<string>> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    const value = await this.page.locator(cssLocator).getAttribute('value');
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

  clone(): IInteractor {
    return new PlaywrightInteractor(this.page);
  }
}
