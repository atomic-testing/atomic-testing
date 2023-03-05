import { IClickOption, IInteractor, LocatorChain } from '@testzilla/core';
import { DOMInteractor } from '@testzilla/dom-core';
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

  override clone(): IInteractor {
    return new ReactInteractor();
  }
}
