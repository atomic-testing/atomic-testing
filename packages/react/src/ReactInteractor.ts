import { IClickOption, IInteractor, LocatorChain } from '@atomic-testing/core';
import { DOMInteractor } from '@atomic-testing/dom-core';
import { act } from 'react-dom/test-utils';

export class ReactInteractor extends DOMInteractor {
  override async enterText(locator: LocatorChain, text: string, option?: Partial<IClickOption>): Promise<void> {
    await act(async () => {
      await super.enterText(locator, text, option);
    });
  }

  override async click(locator: LocatorChain, option?: IClickOption): Promise<void> {
    // TODO: Use perforrm function
    await act(async () => {
      await super.click(locator, option);
    });
  }

  override async hover(locator: LocatorChain): Promise<void> {
    await act(async () => {
      await super.hover(locator);
    });
  }

  override async selectOptionValue(locator: LocatorChain, values: string[]): Promise<void> {
    await act(async () => {
      await super.selectOptionValue(locator, values);
    });
  }

  override clone(): IInteractor {
    return new ReactInteractor();
  }
}
