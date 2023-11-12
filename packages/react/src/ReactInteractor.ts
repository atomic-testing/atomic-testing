import {
  ClickOption,
  EnterTextOption,
  HoverOption,
  Interactor,
  MouseDownOption,
  MouseEnterOption,
  MouseLeaveOption,
  MouseMoveOption,
  MouseOutOption,
  MouseUpOption,
  PartLocator,
} from '@atomic-testing/core';
import { DOMInteractor } from '@atomic-testing/dom-core';
import { act } from 'react-dom/test-utils';

export class ReactInteractor extends DOMInteractor {
  override async enterText(locator: PartLocator, text: string, option?: Partial<EnterTextOption>): Promise<void> {
    await act(async () => {
      await super.enterText(locator, text, option);
    });
  }

  override async click(locator: PartLocator, option?: Partial<ClickOption>): Promise<void> {
    await act(async () => {
      await super.click(locator, option);
    });
  }

  override async hover(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    await act(async () => {
      await super.hover(locator, option);
    });
  }

  async mouseMove(locator: PartLocator, option?: Partial<MouseMoveOption>): Promise<void> {
    await act(async () => {
      await super.mouseMove(locator, option);
    });
  }

  async mouseDown(locator: PartLocator, option?: Partial<MouseDownOption>): Promise<void> {
    await act(async () => {
      await super.mouseDown(locator, option);
    });
  }

  async mouseUp(locator: PartLocator, option?: Partial<MouseUpOption>): Promise<void> {
    await act(async () => {
      await super.mouseUp(locator, option);
    });
  }

  async mouseOver(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    await act(async () => {
      await super.mouseOver(locator, option);
    });
  }

  async mouseOut(locator: PartLocator, option?: Partial<MouseOutOption>): Promise<void> {
    await act(async () => {
      await super.mouseOut(locator, option);
    });
  }

  async mouseEnter(locator: PartLocator, option?: Partial<MouseEnterOption>): Promise<void> {
    await act(async () => {
      await super.mouseEnter(locator, option);
    });
  }

  async mouseLeave(locator: PartLocator, option?: Partial<MouseLeaveOption>): Promise<void> {
    await act(async () => {
      await super.mouseLeave(locator, option);
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
