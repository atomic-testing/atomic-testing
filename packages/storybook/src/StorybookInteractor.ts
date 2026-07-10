import {
  BlurOption,
  ClickOption,
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
  WaitUntilOption,
} from '@atomic-testing/core';
import { DOMInteractor } from '@atomic-testing/dom-core';
import { userEvent } from 'storybook/test';

/**
 * Escalating probe cadence for post-interaction waits (cf. Vitest's poll
 * intervals): the condition usually flips within a frame or two, so probe
 * densely first, then back off. Used as the default `probeIntervals` for
 * every `waitUntil` issued through this interactor.
 */
const settleProbeIntervals: readonly number[] = [0, 20, 50, 100, 100, 500];

/**
 * Interactor for driving component drivers inside a real-browser Storybook —
 * `play` functions in the Storybook UI and stories run under
 * `@storybook/addon-vitest`.
 *
 * Framework-agnostic by design: in a real browser every renderer commits to
 * real DOM asynchronously on its own schedule, so unlike `ReactInteractor` /
 * `VueInteractor` there is no `act()` / `nextTick()` wrapping (React's `act()`
 * is not supported outside a configured test environment and only emits
 * warnings in the preview iframe). Instead, every mutating interaction is
 * followed by {@link StorybookInteractor.settle}, and read-after-write races
 * are further covered by the escalating `waitUntil` cadence.
 *
 * Interactions dispatch through Storybook's instrumented `userEvent` (from
 * `storybook/test`), so they are recorded in the Interactions panel.
 */
export class StorybookInteractor extends DOMInteractor {
  /**
   * @param canvasElement - The story's canvas element (from the `play`
   * context); every locator resolves within it.
   */
  constructor(canvasElement: HTMLElement) {
    super(canvasElement, { userEvent });
  }

  /**
   * Give the active renderer one chance to commit before the caller reads:
   * a macrotask turn (drains Vue's microtask `nextTick` queue and zone.js
   * microtasks first) followed by two animation frames (framework commit +
   * browser paint). Not a guarantee for arbitrarily-async updates — those are
   * what the `waitUntil` cadence is for.
   */
  protected settle(): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        } else {
          resolve();
        }
      }, 0);
    });
  }

  override async enterText(locator: PartLocator, text: string, option?: Partial<EnterTextOption>): Promise<void> {
    await super.enterText(locator, text, option);
    await this.settle();
  }

  override async typeText(locator: PartLocator, text: string): Promise<void> {
    await super.typeText(locator, text);
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

  override waitUntil<T>(option: WaitUntilOption<T>): Promise<T> {
    return super.waitUntil({ probeIntervals: settleProbeIntervals, ...option });
  }
}
