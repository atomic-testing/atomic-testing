import { ClickOption, PartLocator } from '@atomic-testing/core';
import { DOMInteractor } from '@atomic-testing/dom-core';

export class LoggingInteractor extends DOMInteractor {
  async click(locator: PartLocator, option?: Partial<ClickOption>): Promise<void> {
    console.log('clicking', await this.innerHTML(locator));
    await super.click(locator, option);
  }
}
