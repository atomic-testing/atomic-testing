import {
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
import { nextTick } from 'vue';

export class VueInteractor extends DOMInteractor {
  private async flush() {
    await nextTick();
  }

  override async enterText(
    locator: PartLocator,
    text: string,
    option?: Partial<EnterTextOption>,
  ): Promise<void> {
    await super.enterText(locator, text, option);
    await this.flush();
  }

  override async click(
    locator: PartLocator,
    option?: Partial<ClickOption>,
  ): Promise<void> {
    await super.click(locator, option);
    await this.flush();
  }

  override async hover(
    locator: PartLocator,
    option?: Partial<HoverOption>,
  ): Promise<void> {
    await super.hover(locator, option);
    await this.flush();
  }

  async mouseMove(
    locator: PartLocator,
    option?: Partial<MouseMoveOption>,
  ): Promise<void> {
    await super.mouseMove(locator, option);
    await this.flush();
  }

  async mouseDown(
    locator: PartLocator,
    option?: Partial<MouseDownOption>,
  ): Promise<void> {
    await super.mouseDown(locator, option);
    await this.flush();
  }

  async mouseUp(
    locator: PartLocator,
    option?: Partial<MouseUpOption>,
  ): Promise<void> {
    await super.mouseUp(locator, option);
    await this.flush();
  }

  async mouseOver(
    locator: PartLocator,
    option?: Partial<HoverOption>,
  ): Promise<void> {
    await super.mouseOver(locator, option);
    await this.flush();
  }

  async mouseOut(
    locator: PartLocator,
    option?: Partial<MouseOutOption>,
  ): Promise<void> {
    await super.mouseOut(locator, option);
    await this.flush();
  }

  async mouseEnter(
    locator: PartLocator,
    option?: Partial<MouseEnterOption>,
  ): Promise<void> {
    await super.mouseEnter(locator, option);
    await this.flush();
  }

  async mouseLeave(
    locator: PartLocator,
    option?: Partial<MouseLeaveOption>,
  ): Promise<void> {
    await super.mouseLeave(locator, option);
    await this.flush();
  }

  async focus(locator: PartLocator, option?: Partial<FocusOption>): Promise<void> {
    await super.focus(locator, option);
    await this.flush();
  }

  override async selectOptionValue(
    locator: PartLocator,
    values: string[],
  ): Promise<void> {
    await super.selectOptionValue(locator, values);
    await this.flush();
  }

  override async wait(ms: number): Promise<void> {
    await super.wait(ms);
    await this.flush();
  }

  override async waitUntilComponentState(
    locator: PartLocator,
    option: Partial<Readonly<WaitForOption>> = defaultWaitForOption,
  ): Promise<void> {
    await super.waitUntilComponentState(locator, option);
    await this.flush();
  }

  override async waitUntil<T>(option: WaitUntilOption<T>): Promise<T> {
    const result = await super.waitUntil(option);
    await this.flush();
    return result;
  }

  override clone(): Interactor {
    return new VueInteractor();
  }
}
