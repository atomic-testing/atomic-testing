import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  byRole,
  childListHelper,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { CarouselCardDriver } from './CarouselCardDriver';
import { CarouselNavDriver } from './CarouselNavDriver';

const navLocator = byCssClass('fui-CarouselNav');
const navButtonLocator = byRole('tab');
const emblaSettleTimeoutMs = 1000;
const carouselButtonSelector = '.fui-CarouselButton';
// `CarouselButton`s are usually direct children of `Carousel` (manual
// composition) but Fluent's own `CarouselNavContainer` wraps them in an
// extra `<div>` alongside `CarouselNav` — `'*'` descends through either
// shape uniformly, the same recursion `NavDriver` uses to flatten its own
// arbitrarily-nested item tree (see `internal/navLocators.ts`).
const anyWrapperSelector = '*';

/**
 * `CarouselCard`s are `Carousel`'s slide content, addressed positionally
 * regardless of the `CarouselViewport`/`CarouselSlider` wrapper depth between
 * them and the root (DOM audit, `@fluentui/react-carousel@9.9.10`: both
 * wrappers render no interactive state of their own — `CarouselViewport` is
 * `role="presentation"`, `CarouselSlider` is a plain `role="group"` — so
 * this driver folds them in by not modeling them at all, the same
 * "not independently interactive" rule `CardDriver` uses for
 * `CardHeader`/`CardFooter`/`CardPreview`). `byCssClass`'s default
 * `'Descendant'` relative position matches through that wrapper depth
 * without needing to know it.
 */
export const defaultCarouselDriverOption: ListComponentDriverSpecificOption<CarouselCardDriver> = {
  itemClass: CarouselCardDriver,
  itemLocator: byCssClass('fui-CarouselCard'),
};

type CarouselDriverOption<ItemT extends CarouselCardDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Fluent v9 `Carousel` (+ `CarouselViewport`/`CarouselSlider`/
 * `CarouselCard`/`CarouselNav`/`CarouselButton`).
 *
 * DOM audit (`@fluentui/react-components@9.74.3`, `@fluentui/react-carousel@9.9.10`,
 * confirmed by rendering a real `Carousel` — see `Carousel.examples.tsx`'s
 * class doc): root is `<div role="region" class="fui-Carousel">` — NOT
 * `aria-roledescription="carousel"` as the ARIA APG carousel pattern
 * recommends and `component-driver-astryx`'s hand-rolled Carousel sets;
 * Fluent's `useCarousel_unstable` never stamps it, so this driver does not
 * assume it. A {@link ListComponentDriver} over the `.fui-CarouselCard`
 * children (see `defaultCarouselDriverOption` above for the wrapper-depth
 * note), templated off `AccordionDriver`'s shape.
 *
 * **Real navigation is E2E-only.** `Carousel` is built on `embla-carousel`
 * (confirmed: `useEmblaCarousel.js` wraps `embla-carousel@8.6.0`), which
 * needs real layout (`getBoundingClientRect`, `ResizeObserver`,
 * `IntersectionObserver`) to compute scroll-snap positions — unavailable
 * under jsdom (no layout engine at all, stronger than the already-documented
 * `ResizeObserver`/`MessageBar` gap: `Carousel` cannot even MOUNT under
 * jsdom without polyfilling `window.matchMedia`/`IntersectionObserver` too —
 * `embla-carousel`'s `OptionsHandler.optionsMediaQueries` unconditionally
 * calls `.map(ownerWindow.matchMedia)` during its first activation effect,
 * which throws immediately if `matchMedia` isn't callable at all, regardless
 * of whether the consumer configured `breakpoints`). Confirmed via render:
 * with those three globals stubbed inert (the minimum needed just to mount,
 * not to make navigation work), jsdom's zero-size layout collapses every
 * configuration to a single degenerate "snap group" — {@link scrollNext}/
 * {@link scrollPrev} click a genuinely mounted, genuinely no-op (permanently
 * `disabled`) button pair there, mirroring `component-driver-astryx`'s own
 * `CarouselDriver.scrollNext`/`scrollPrev` E2E-only contract. Card
 * enumeration/text (this driver's `ListComponentDriver` surface) and
 * {@link getLabel} are plain DOM structure/attribute reads, independent of
 * `embla-carousel` state, and stay portable to both environments.
 *
 * **No default accessible name on `CarouselButton`, and `navType` is not
 * reflected to the DOM at all** (DOM/type audit: `CarouselButtonProps` sets
 * no default `aria-label`, and `navType` is destructured out of the props
 * spread before reaching the native `<button>` — verified against rendered
 * DOM, both buttons carry identical `class="fui-CarouselButton fui-Button ..."`
 * with no other differentiator). {@link scrollPrev}/{@link scrollNext}
 * therefore resolve the pair by DOM POSITION among descendant
 * `.fui-CarouselButton` elements (first = prev, last = next) — this matches
 * both a manual `prev, ..., next` composition (this package's own example)
 * and Fluent's own `CarouselNavContainer` wrapper, which renders in that
 * same order. Same class of documented assumption as `OverflowDriver`'s
 * "assumes idiomatic flat-row usage": a consumer rendering only ONE
 * `CarouselButton`, or in reverse order, is not resolved correctly.
 */
export class CarouselDriver<ItemT extends CarouselCardDriver = CarouselCardDriver> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<CarouselDriverOption<ItemT>> = {}) {
    // Merged in (not a default parameter) for the same reason as
    // AccordionDriver/TabListDriver: the test engine always passes an option
    // object for a scene part, which would otherwise shadow a default-valued
    // parameter and leave itemLocator unset.
    super(locator, interactor, {
      ...defaultCarouselDriverOption,
      ...option,
    } as CarouselDriverOption<ItemT>);
  }

  /** The carousel's accessible label (`aria-label`). Portable. */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** Number of `CarouselCard`s in the carousel. Portable — see class doc. */
  async getCardCount(): Promise<number> {
    return this.getItemCount();
  }

  /** Every `CarouselCard`'s driver, in DOM order. Portable — see class doc. */
  async getCards(): Promise<ItemT[]> {
    return this.getItems();
  }

  /** The `CarouselCard` at the given zero-based index, or `null` when out of range. Portable — see class doc. */
  async getCardByIndex(index: number): Promise<ItemT | null> {
    return this.getItemByIndex(index);
  }

  /**
   * The `CarouselNav` this carousel renders, or `null` when it has none.
   * Container existence is portable; its item surface is E2E-only — see
   * {@link CarouselNavDriver}'s class doc.
   *
   * Waits for at least one `CarouselNavButton` to render before returning —
   * verified against real Chromium: the `.fui-CarouselNav` container itself
   * mounts synchronously, but `embla-carousel`'s scroll-snap-group
   * computation (which determines how many nav buttons render) runs behind a
   * `ResizeObserver`-driven layout pass, so a read immediately after
   * navigation can observe a transient ZERO-button state — a real timing
   * race, not a jsdom-only approximation issue (see class doc's jsdom
   * caveat, which is a separate, permanent gap).
   */
  async getNav(): Promise<CarouselNavDriver | null> {
    const resolvedNavLocator = locatorUtil.append(this.locator, navLocator);
    const exists = await this.interactor.exists(resolvedNavLocator);
    if (!exists) {
      return null;
    }
    await this.interactor.waitUntil({
      probeFn: () => this.interactor.getElementCount(locatorUtil.append(resolvedNavLocator, navButtonLocator)),
      terminateCondition: (count: number) => count > 0,
      timeoutMs: emblaSettleTimeoutMs,
    });
    return new CarouselNavDriver(resolvedNavLocator, this.interactor, this.commutableOption);
  }

  private getCarouselButtons(): Promise<HTMLButtonDriver[]> {
    return childListHelper.getMatchingChildren(
      this,
      this.locator,
      carouselButtonSelector,
      HTMLButtonDriver,
      anyWrapperSelector
    );
  }

  /** Whether the "previous" `CarouselButton` is disabled (start of a non-circular carousel). E2E-only — see class doc. `true` when no such button is rendered. */
  async isPrevDisabled(): Promise<boolean> {
    const [prev] = await this.getCarouselButtons();
    return prev == null ? true : prev.isDisabled();
  }

  /** Whether the "next" `CarouselButton` is disabled (end of a non-circular carousel). E2E-only — see class doc. `true` when no such button is rendered. */
  async isNextDisabled(): Promise<boolean> {
    const buttons = await this.getCarouselButtons();
    const next = buttons[buttons.length - 1];
    return next == null ? true : next.isDisabled();
  }

  /** Navigate to the previous slide(s) by clicking the "previous" `CarouselButton`. No-ops when absent or disabled. E2E-only — see class doc. */
  async scrollPrev(): Promise<void> {
    const [prev] = await this.getCarouselButtons();
    if (prev != null && !(await prev.isDisabled())) {
      await prev.click();
    }
  }

  /** Navigate to the next slide(s) by clicking the "next" `CarouselButton`. No-ops when absent or disabled. E2E-only — see class doc. */
  async scrollNext(): Promise<void> {
    const buttons = await this.getCarouselButtons();
    const next = buttons[buttons.length - 1];
    if (next != null && !(await next.isDisabled())) {
      await next.click();
    }
  }

  override get driverName(): string {
    return 'FluentV9CarouselDriver';
  }
}
