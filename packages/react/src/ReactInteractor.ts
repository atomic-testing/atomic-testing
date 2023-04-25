import { ClickOption, Interactor, PartLocator } from '@atomic-testing/core';
import { DOMInteractor } from '@atomic-testing/dom-core';
import { act } from 'react-dom/test-utils';

export class ReactInteractor extends DOMInteractor {
  override async enterText(locator: PartLocator, text: string, option?: Partial<ClickOption>): Promise<void> {
    await act(async () => {
      await super.enterText(locator, text, option);
    });
  }

  override async click(locator: PartLocator, option?: ClickOption): Promise<void> {
    // TODO: Use perforrm function
    await act(async () => {
      await super.click(locator, option);
    });
  }

  override async hover(locator: PartLocator): Promise<void> {
    await act(async () => {
      await super.hover(locator);
    });
  }

  override async selectOptionValue(locator: PartLocator, values: string[]): Promise<void> {
    await act(async () => {
      await super.selectOptionValue(locator, values);
    });
  }

  override async wait(ms: number): Promise<void> {
    await act(async () => {
      await super.wait(ms);
    });
  }

  override clone(): Interactor {
    return new ReactInteractor();
  }
}
