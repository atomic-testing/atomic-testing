import {
  BlurOption,
  ClickOption,
  defaultWaitForOption,
  EnterTextOption,
  FocusOption,
  HoverOption,
  Interactor,
  MouseDownOption,
  MouseEnterOption,
  MouseLeaveOption,
  MouseMoveOption,
  MouseOutOption,
  MouseUpOption,
  PartLocator,
  WaitForOption,
  WaitUntilOption,
} from '@atomic-testing/core';
import { DOMInteractor } from '@atomic-testing/dom-core';
import { act } from '@testing-library/react';

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

  override async mouseMove(locator: PartLocator, option?: Partial<MouseMoveOption>): Promise<void> {
    await act(async () => {
      await super.mouseMove(locator, option);
    });
  }

  override async mouseDown(locator: PartLocator, option?: Partial<MouseDownOption>): Promise<void> {
    await act(async () => {
      await super.mouseDown(locator, option);
    });
  }

  override async mouseUp(locator: PartLocator, option?: Partial<MouseUpOption>): Promise<void> {
    await act(async () => {
      await super.mouseUp(locator, option);
    });
  }

  override async mouseOver(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    await act(async () => {
      await super.mouseOver(locator, option);
    });
  }

  override async mouseOut(locator: PartLocator, option?: Partial<MouseOutOption>): Promise<void> {
    await act(async () => {
      await super.mouseOut(locator, option);
    });
  }

  override async mouseEnter(locator: PartLocator, option?: Partial<MouseEnterOption>): Promise<void> {
    await act(async () => {
      await super.mouseEnter(locator, option);
    });
  }

  override async mouseLeave(locator: PartLocator, option?: Partial<MouseLeaveOption>): Promise<void> {
    await act(async () => {
      await super.mouseLeave(locator, option);
    });
  }

  override async focus(locator: PartLocator, option?: Partial<FocusOption>): Promise<void> {
    await act(async () => {
      await super.focus(locator, option);
    });
  }

  override async blur(locator: PartLocator, option?: Partial<BlurOption>): Promise<void> {
    await act(async () => {
      await super.blur(locator, option);
    });
  }

  override async selectOptionValue(locator: PartLocator, values: string[]): Promise<void> {
    await act(async () => {
      await super.selectOptionValue(locator, values);
    });
  }

  //#region wait condition
  override async wait(ms: number): Promise<void> {
    await act(async () => {
      await super.wait(ms);
    });
  }

  override async waitUntilComponentState(
    locator: PartLocator,
    option: Partial<Readonly<WaitForOption>> = defaultWaitForOption
  ): Promise<void> {
    await act(async () => {
      await super.waitUntilComponentState(locator, option);
    });
  }

  override async waitUntil<T>(option: WaitUntilOption<T>): Promise<T> {
    return await act(async () => {
      return await super.waitUntil(option);
    });
  }
  //#endregion

  override clone(): Interactor {
    return new ReactInteractor(this.rootEl);
  }
}
