import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for a single Fluent v9 `CarouselNavButton` (a nav "dot", a child of
 * `CarouselNav` — see {@link CarouselNavDriver}).
 *
 * DOM audit (`@fluentui/react-components@9.74.3`, `@fluentui/react-carousel@9.9.10`):
 * renders a real native `<button role="tab" type="button" aria-selected>` —
 * the identical ARIA APG tablist/tab pattern this package's own
 * `TabDriver` already covers, so `isSelected`/`select` are templated
 * directly off it. Fluent renders NO visible text by default (a nav button
 * is a bare styled dot); `getLabel()` reads the consumer-supplied
 * `aria-label` instead — required for the button to have any accessible
 * name at all, and the only reliable way to identify which slide a given
 * dot corresponds to (see this package's `Carousel.examples.tsx`, which sets
 * one per button).
 *
 * Unlike a toggle button this is intentionally not an `IToggleDriver`: a
 * nav button can be selected but not toggled off (selecting another
 * deselects it), mirroring `TabDriver`'s own reasoning — only `isSelected`/
 * `select` are exposed.
 */
export class CarouselNavButtonDriver extends ComponentDriver<{}> {
  /** The consumer-supplied `aria-label` identifying which slide this dot navigates to. See class doc. */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** Whether this is the currently active nav button (`aria-selected="true"`). E2E-only — see {@link CarouselNavDriver}'s class doc. */
  async isSelected(): Promise<boolean> {
    const value = await this.interactor.getAttribute(this.locator, 'aria-selected');
    return value === 'true';
  }

  /** Navigate to this button's slide by clicking it, unless it is already selected. E2E-only — see {@link CarouselNavDriver}'s class doc. */
  async select(): Promise<void> {
    if (await this.isSelected()) {
      return;
    }
    await this.interactor.click(this.locator);
  }

  get driverName(): string {
    return 'FluentV9CarouselNavButtonDriver';
  }
}
