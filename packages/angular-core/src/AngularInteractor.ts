import {
  BlurOption,
  ClickOption,
  defaultWaitForOption,
  EnterTextOption,
  FocusOption,
  HoverOption,
  MouseDownOption,
  MouseEnterOption,
  MouseLeaveOption,
  MouseMoveOption,
  MouseOutOption,
  MouseUpOption,
  PartLocator,
  Point,
  PressKeyOption,
  WaitForOption,
  WaitUntilOption,
} from '@atomic-testing/core';
import { DOMInteractor } from '@atomic-testing/dom-core';

import { defaultSettleTimeoutMs, settleAppStability } from './settling';
import { AngularAppStability, AngularInteractorOption } from './types';

/**
 * Interactor for Angular applications. Every interaction is followed by a
 * settle step so the framework's change detection has flushed before the
 * method resolves — the Angular counterpart of `ReactInteractor` wrapping
 * interactions in `act()`.
 *
 * Settling is driven by `ApplicationRef.whenStable()`, which resolves once
 * change detection is idle under **both** zone.js and zoneless change
 * detection, so no zone.js feature detection is needed here. Unlike React's
 * global `act()`, stability is an instance concern — each bootstrapped app has
 * its own `ApplicationRef` — which is why the reference is injected at
 * construction rather than imported.
 */
export class AngularInteractor extends DOMInteractor {
  private readonly settleTimeoutMs: number;

  constructor(
    private readonly appStability?: AngularAppStability,
    rootEl?: HTMLElement,
    option?: AngularInteractorOption
  ) {
    super(rootEl ?? document.documentElement, option);
    this.settleTimeoutMs = option?.settleTimeoutMs ?? defaultSettleTimeoutMs;
  }

  private settle(): Promise<void> {
    return settleAppStability(this.appStability, this.settleTimeoutMs);
  }

  override async enterText(locator: PartLocator, text: string, option?: Partial<EnterTextOption>): Promise<void> {
    await super.enterText(locator, text, option);
    await this.settle();
  }

  override async setRangeValue(locator: PartLocator, value: number): Promise<void> {
    await super.setRangeValue(locator, value);
    await this.settle();
  }

  override async click(locator: PartLocator, option?: Partial<ClickOption>): Promise<void> {
    await super.click(locator, option);
    await this.settle();
  }

  override async hover(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    await super.hover(locator, option);
    await this.settle();
  }

  override async mouseMove(locator: PartLocator, option?: Partial<MouseMoveOption>): Promise<void> {
    await super.mouseMove(locator, option);
    await this.settle();
  }

  override async mouseDown(locator: PartLocator, option?: Partial<MouseDownOption>): Promise<void> {
    await super.mouseDown(locator, option);
    await this.settle();
  }

  override async mouseUp(locator: PartLocator, option?: Partial<MouseUpOption>): Promise<void> {
    await super.mouseUp(locator, option);
    await this.settle();
  }

  override async mouseOver(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    await super.mouseOver(locator, option);
    await this.settle();
  }

  override async mouseOut(locator: PartLocator, option?: Partial<MouseOutOption>): Promise<void> {
    await super.mouseOut(locator, option);
    await this.settle();
  }

  override async mouseEnter(locator: PartLocator, option?: Partial<MouseEnterOption>): Promise<void> {
    await super.mouseEnter(locator, option);
    await this.settle();
  }

  override async mouseLeave(locator: PartLocator, option?: Partial<MouseLeaveOption>): Promise<void> {
    await super.mouseLeave(locator, option);
    await this.settle();
  }

  override async focus(locator: PartLocator, option?: Partial<FocusOption>): Promise<void> {
    await super.focus(locator, option);
    await this.settle();
  }

  override async blur(locator: PartLocator, option?: Partial<BlurOption>): Promise<void> {
    await super.blur(locator, option);
    await this.settle();
  }

  override async pressKey(locator: PartLocator, key: string, option?: Partial<PressKeyOption>): Promise<void> {
    await super.pressKey(locator, key, option);
    await this.settle();
  }

  override async contextMenu(locator: PartLocator): Promise<void> {
    await super.contextMenu(locator);
    await this.settle();
  }

  override async activate(locator: PartLocator): Promise<void> {
    await super.activate(locator);
    await this.settle();
  }

  override async selectOptionValue(locator: PartLocator, values: string[]): Promise<void> {
    await super.selectOptionValue(locator, values);
    await this.settle();
  }

  override async setInputFiles(locator: PartLocator, files: string | string[]): Promise<void> {
    await super.setInputFiles(locator, files);
    await this.settle();
  }

  override async scrollIntoView(locator: PartLocator): Promise<void> {
    await super.scrollIntoView(locator);
    await this.settle();
  }

  override async scrollBy(locator: PartLocator, delta: Point): Promise<void> {
    await super.scrollBy(locator, delta);
    await this.settle();
  }

  override async dragTo(source: PartLocator, target: PartLocator): Promise<void> {
    await super.dragTo(source, target);
    await this.settle();
  }

  override async drag(locator: PartLocator, delta: Point): Promise<void> {
    await super.drag(locator, delta);
    await this.settle();
  }

  //#region wait condition
  override async waitUntilComponentState(
    locator: PartLocator,
    option: Partial<Readonly<WaitForOption>> = defaultWaitForOption
  ): Promise<void> {
    await super.waitUntilComponentState(locator, option);
    await this.settle();
  }

  override async waitUntil<T>(option: WaitUntilOption<T>): Promise<T> {
    const result = await super.waitUntil(option);
    await this.settle();
    return result;
  }
  //#endregion
}
