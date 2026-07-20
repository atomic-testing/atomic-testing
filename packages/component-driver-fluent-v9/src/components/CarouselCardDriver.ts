import { ComponentDriver } from '@atomic-testing/core';

/**
 * Driver for a single Fluent v9 `CarouselCard` (a slide's content — a child
 * of `Carousel`, reached via {@link CarouselDriver.getCards}/
 * {@link CarouselDriver.getCardByIndex}).
 *
 * DOM audit (`@fluentui/react-components@9.74.3`, `@fluentui/react-carousel@9.9.10`):
 * renders `<div role="tabpanel" class="fui-CarouselCard" id="fui-CarouselCard_r_N_">`.
 * A card's content is arbitrary consumer UI with no other fixed semantic
 * state, so this driver relies mostly on the inherited `getText()`/`exists()`
 * — it exists as a distinct type so {@link CarouselDriver} can expose typed
 * card drivers, the same "identity-only" shape as
 * `component-driver-mui-v9`'s `TableCellDriver`.
 *
 * **{@link isActive} is E2E-only.** Fluent toggles a non-visible card's
 * `aria-hidden`/`inert` from an `IntersectionObserver` callback fired by its
 * `embla-carousel` engine (`useCarouselCard_unstable`'s internal
 * `EMBLA_VISIBILITY_EVENT` listener) — real intersection needs real layout.
 * Confirmed by rendering a real `Carousel` under jsdom (with
 * `IntersectionObserver` stubbed inert, the minimum polyfill needed just to
 * mount `Carousel` there at all — see `Carousel.examples.tsx`'s class doc):
 * EVERY card's `aria-hidden` stays entirely ABSENT regardless of which slide
 * is actually active, so {@link isActive} would report every card as active
 * there — not merely imprecise, meaningless. This is a materially stronger
 * jsdom gap than the already-documented `ResizeObserver`/`MessageBar` one
 * (which degrades gracefully instead of never firing at all).
 *
 * Also requires the DEFAULT `cardFocus={false}` on the parent `Carousel`
 * (`CarouselSlider`'s prop) even in a real browser — Fluent's own listener
 * skips the `aria-hidden`/`inert` toggle entirely when `cardFocus` is set
 * (verified against `useCarouselCard_unstable`'s source), a mode this
 * example does not use.
 */
export class CarouselCardDriver extends ComponentDriver<{}> {
  /**
   * Whether this card is the currently visible/active slide, read from the
   * ABSENCE of `aria-hidden="true"` (Fluent stamps it only on non-visible
   * cards). E2E-only — see class doc.
   */
  async isActive(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-hidden')) !== 'true';
  }

  get driverName(): string {
    return 'FluentV9CarouselCardDriver';
  }
}
