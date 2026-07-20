import {
  byRole,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  listHelper,
  PartLocator,
} from '@atomic-testing/core';

import { CarouselNavButtonDriver } from './CarouselNavButtonDriver';

/**
 * `CarouselNavButton`s are `CarouselNav`'s only children (DOM audit,
 * `@fluentui/react-carousel@9.9.10`: `role="tablist"` wrapping only
 * `role="tab"` buttons, no interleaved non-tab elements) — the identical
 * ARIA APG tablist/tab shape `TabListDriver` already covers, so this reuses
 * the same `byRole('tab')` item locator that driver's own DOM audit
 * establishes is safe here.
 */
export const defaultCarouselNavDriverOption: ListComponentDriverSpecificOption<CarouselNavButtonDriver> = {
  itemClass: CarouselNavButtonDriver,
  itemLocator: byRole('tab'),
};

type CarouselNavDriverOption<ItemT extends CarouselNavButtonDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Fluent v9 `CarouselNav` (holding `CarouselNavButton`
 * children — see {@link CarouselNavButtonDriver}), reached via
 * {@link CarouselDriver.getNav}.
 *
 * A {@link ListComponentDriver} over the `role="tab"` children, templated
 * directly off `TabListDriver`'s shape (see `defaultCarouselNavDriverOption`
 * above for why the same item locator is safe).
 *
 * **Item count/enumeration/active-index reads are E2E-only.** `CarouselNav`
 * renders exactly one `CarouselNavButton` per `embla-carousel` "scroll snap
 * group" — a real layout computation (`slidesToScroll`/`groupSize`, snap-point
 * geometry via `getBoundingClientRect`). Confirmed by rendering a real
 * `Carousel` with 3 `CarouselCard`s under jsdom (`IntersectionObserver`/
 * `ResizeObserver`/`window.matchMedia` all stubbed — the minimum needed just
 * to mount `Carousel` there at all; see `Carousel.examples.tsx`'s class doc):
 * jsdom's zero-size layout collapses EVERY configuration tried (including an
 * explicit `groupSize={1}`, which should yield one nav button per card) down
 * to exactly ONE snap group — so exactly ONE `CarouselNavButton` renders
 * regardless of the real card count. This is not an approximation of the
 * real value, it is a fixed, wrong constant — so {@link getItemCount}
 * (inherited from {@link ListComponentDriver}), {@link getActiveIndex}, and
 * {@link selectByIndex} are meaningful only in a real browser. The container
 * itself (`role="tablist"`, `.fui-CarouselNav`) DOES render correctly under
 * jsdom regardless — only its CHILDREN are affected — so
 * {@link CarouselDriver.getNav}'s own existence check stays portable.
 */
export class CarouselNavDriver<
  ItemT extends CarouselNavButtonDriver = CarouselNavButtonDriver,
> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<CarouselNavDriverOption<ItemT>> = {}) {
    // Defaults applied LAST so they win over any inherited `itemLocator`/
    // `itemClass` — same reason as `TableRowDriver`/`TableHeaderRowDriver`:
    // `CarouselDriver.getNav()` constructs this driver from ITS OWN
    // `commutableOption` (carrying `CarouselCardDriver`/`.fui-CarouselCard`,
    // the GALLERY's own item config), which would otherwise shadow this
    // class's own `CarouselNavButtonDriver`/`role="tab"` item config and
    // silently zero out every nav-button read.
    super(locator, interactor, {
      ...option,
      ...defaultCarouselNavDriverOption,
    } as CarouselNavDriverOption<ItemT>);
  }

  /** Zero-based index of the currently active nav button, or `-1` when none is selected. E2E-only — see class doc. */
  async getActiveIndex(): Promise<number> {
    let index = 0;
    for await (const item of listHelper.getListItemIterator(this, this.getItemLocator(), this.getItemClass())) {
      if (await item.isSelected()) {
        return index;
      }
      index++;
    }
    return -1;
  }

  /**
   * Navigate to the slide at the given zero-based nav index. E2E-only — see class doc.
   * @returns `false` when the index is out of range.
   */
  async selectByIndex(index: number): Promise<boolean> {
    const item = await this.getItemByIndex(index);
    if (item == null) {
      return false;
    }
    await item.select();
    return true;
  }

  override get driverName(): string {
    return 'FluentV9CarouselNavDriver';
  }
}
