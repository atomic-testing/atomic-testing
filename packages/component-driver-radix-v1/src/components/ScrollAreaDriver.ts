import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  locatorUtil,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
  viewport: {
    locator: byCssSelector('[data-radix-scroll-area-viewport]'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export type ScrollbarOrientation = 'vertical' | 'horizontal';

/**
 * Driver for the Radix ScrollArea primitive (`ScrollArea.Root` from `radix-ui`).
 *
 * The viewport (`[data-radix-scroll-area-viewport]`) is a real `overflow: scroll`
 * element — the Wave 0 capability-gap audit verified `scrollTop` moving 0 → 200 via
 * {@link Interactor.scrollBy} against it. It is exposed here as the `viewport`
 * part so callers reach the inherited {@link ComponentDriver.scrollBy} /
 * {@link ComponentDriver.scrollIntoView} / {@link ComponentDriver.getBoundingRect}
 * directly on it, rather than this driver re-declaring pass-through wrappers.
 * Scroll behavior is E2E-only: jsdom has no layout engine, so `scrollTop` never
 * changes there and `getBoundingRect` returns a zero-rect — those calls resolve
 * without throwing under jsdom but assert nothing about position.
 *
 * The scrollbar's `data-state` (`'visible' | 'hidden'`) reflects Radix's `type`
 * prop behavior (`hover`/`scroll`/`auto`/`always`) and is a structural attribute,
 * not geometry, so it renders faithfully under jsdom too — exposed via
 * {@link getScrollbarState}.
 */
export class ScrollAreaDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  /**
   * The `data-state` of the scrollbar for the given axis (`'visible'` or
   * `'hidden'`), or `undefined` when no scrollbar for that axis is rendered.
   *
   * Guarded with {@link Interactor.exists} first: reading an attribute off an
   * absent node auto-waits to the timeout in Playwright (jsdom returns
   * `undefined` immediately), the same cross-engine gotcha `TextFieldDriver`
   * documents for `getHelperText`.
   */
  async getScrollbarState(orientation: ScrollbarOrientation): Promise<Optional<string>> {
    const locator = this.scrollbarLocator(orientation);
    if (!(await this.interactor.exists(locator))) {
      return undefined;
    }
    return this.interactor.getAttribute(locator, 'data-state');
  }

  private scrollbarLocator(orientation: ScrollbarOrientation): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`[data-orientation="${orientation}"]`));
  }

  override get driverName(): string {
    return 'RadixV1ScrollAreaDriver';
  }
}
