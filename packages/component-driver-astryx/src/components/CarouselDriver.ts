import {
  byAriaLabel,
  byCssSelector,
  childListHelper,
  ComponentDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

const SCROLL_LEFT = byAriaLabel('Scroll left');
const SCROLL_RIGHT = byAriaLabel('Scroll right');

/** Astryx wraps each slide in the APG carousel pattern's `role="group"`. */
const SLIDE_SELECTOR = '[role="group"]';

/**
 * Driver for the Astryx Carousel (`@astryxdesign/core/Carousel`).
 *
 * The scene anchors this driver on the root, which self-emits `data-testid` and is
 * the `role="region"` (`aria-roledescription="carousel"`) landmark. Its first child
 * `<div>` is the horizontal scroll track; each direct child of that track is one
 * item. Prev/next controls render on the top layer as
 * `aria-label="Scroll left"`/`"Scroll right"` buttons.
 *
 * Overflow is a layout concern jsdom cannot model: a real browser only shows the
 * scroll buttons when the content overflows, and actual scrolling moves pixels —
 * so {@link scrollNext}/{@link scrollPrev} are E2E-only, and {@link hasNavButtons}
 * reports whether the controls are *mounted* (always true in jsdom; overflow-gated
 * in the browser). The label and item count read faithfully everywhere.
 */
export class CarouselDriver extends ComponentDriver {
  /**
   * The horizontal scroll track — the root's first `<div>`.
   *
   * `:first-of-type` rather than `:first-child`: it counts among `<div>` siblings
   * only, so the inert `<template>` layer markers Astryx 0.4.2 emits for any
   * context layer in the carousel cannot displace it.
   */
  private get track(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('> div:first-of-type'));
  }

  /** The carousel's accessible label (`aria-label`). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /**
   * Number of items in the scroll track.
   *
   * Astryx wraps every slide in a `role="group"`
   * (`aria-roledescription="slide"`, the APG carousel pattern), so the slides are
   * counted by that role rather than by "every element child" — which would also
   * count a layer marker parked in the track.
   */
  async getItemCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.track, SLIDE_SELECTOR);
  }

  /** Whether the prev/next controls are mounted (always true in jsdom; overflow-gated in the browser). */
  async hasNavButtons(): Promise<boolean> {
    return this.interactor.exists(locatorUtil.append(this.locator, SCROLL_RIGHT));
  }

  /** Scroll to the next items by clicking the "Scroll right" control (E2E-only behaviour). */
  async scrollNext(): Promise<void> {
    await this.interactor.click(locatorUtil.append(this.locator, SCROLL_RIGHT));
  }

  /** Scroll to the previous items by clicking the "Scroll left" control (E2E-only behaviour). */
  async scrollPrev(): Promise<void> {
    await this.interactor.click(locatorUtil.append(this.locator, SCROLL_LEFT));
  }

  override get driverName(): string {
    return 'AstryxCarouselDriver';
  }
}
