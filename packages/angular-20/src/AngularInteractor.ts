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
import { ComponentFixture } from '@angular/core/testing';

export class AngularInteractor extends DOMInteractor {
  constructor(private readonly fixture?: ComponentFixture<any>) {
    super(fixture?.nativeElement);
  }

  private detect() {
    if (this.fixture) {
      this.fixture.detectChanges();
    }
  }

  override async enterText(locator: PartLocator, text: string, option?: Partial<EnterTextOption>): Promise<void> {
    await super.enterText(locator, text, option);
    this.detect();
  }

  override async click(locator: PartLocator, option?: Partial<ClickOption>): Promise<void> {
    await super.click(locator, option);
    this.detect();
  }

  override async hover(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    await super.hover(locator, option);
    this.detect();
  }

  async mouseMove(locator: PartLocator, option?: Partial<MouseMoveOption>): Promise<void> {
    await super.mouseMove(locator, option);
    this.detect();
  }

  async mouseDown(locator: PartLocator, option?: Partial<MouseDownOption>): Promise<void> {
    await super.mouseDown(locator, option);
    this.detect();
  }

  async mouseUp(locator: PartLocator, option?: Partial<MouseUpOption>): Promise<void> {
    await super.mouseUp(locator, option);
    this.detect();
  }

  async mouseOver(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    await super.mouseOver(locator, option);
    this.detect();
  }

  async mouseOut(locator: PartLocator, option?: Partial<MouseOutOption>): Promise<void> {
    await super.mouseOut(locator, option);
    this.detect();
  }

  async mouseEnter(locator: PartLocator, option?: Partial<MouseEnterOption>): Promise<void> {
    await super.mouseEnter(locator, option);
    this.detect();
  }

  async mouseLeave(locator: PartLocator, option?: Partial<MouseLeaveOption>): Promise<void> {
    await super.mouseLeave(locator, option);
    this.detect();
  }

  async focus(locator: PartLocator, option?: Partial<FocusOption>): Promise<void> {
    await super.focus(locator, option);
    this.detect();
  }

  override async selectOptionValue(locator: PartLocator, values: string[]): Promise<void> {
    await super.selectOptionValue(locator, values);
    this.detect();
  }

  override async wait(ms: number): Promise<void> {
    await super.wait(ms);
    this.detect();
  }

  override async waitUntilComponentState(
    locator: PartLocator,
    option: Partial<Readonly<WaitForOption>> = defaultWaitForOption
  ): Promise<void> {
    await super.waitUntilComponentState(locator, option);
    this.detect();
  }

  override async waitUntil<T>(option: WaitUntilOption<T>): Promise<T> {
    const result = await super.waitUntil(option);
    this.detect();
    return result;
  }

  override clone(): Interactor {
    return new AngularInteractor(this.fixture);
  }
}
