import { childListHelper, ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * The toolbar's focusable controls, mirroring Astryx's own roving-focus item
 * model (`useListFocus({ itemSelector: 'button, input, [tabindex="0"]' })`). The
 * three selectors are kept disjoint (`[tabindex="0"]` excludes `button`/`input`)
 * so a focusable button is not counted twice, and each is a single selector (no
 * `,` union) so it composes through `childListHelper`'s positional walk.
 */
const TOOLBAR_ITEM_SELECTORS = ['button', 'input', '[tabindex="0"]:not(button):not(input)'];

/**
 * Driver for the Astryx Toolbar (`@astryxdesign/core/Toolbar`).
 *
 * Toolbar's DOM root is a section `<div>` with no role; the semantic element is an
 * inner `<div role="toolbar">` that is also where `data-testid` lands (Toolbar
 * spreads unknown props there) — so the scene anchors that inner div by testid or
 * by `byRole('toolbar')`, and this driver reads its accessible name
 * (`aria-label`), orientation (`aria-orientation`), and size (`data-size`)
 * straight off the root locator. Items live in start/center/end slot wrappers, so
 * the count descends through them (see {@link getItemCount}).
 *
 * Keyboard roving navigation (Arrow/Home/End via Astryx's `useListFocus`) is a
 * focus-management behaviour that jsdom cannot model faithfully and is therefore
 * left to the Playwright E2E run rather than exposed here.
 */
export class ToolbarDriver extends ComponentDriver {
  /** The toolbar's accessible name (`aria-label`, set from the `label` prop). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** The toolbar's orientation (`aria-orientation`), e.g. `'horizontal'`/`'vertical'`. */
  async getOrientation(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-orientation');
  }

  /** The toolbar's size token (`data-size`), e.g. `'sm'`/`'md'`/`'lg'`. */
  async getSize(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-size');
  }

  /**
   * Number of focusable items in the toolbar, counted by descending through the
   * slot wrappers ({@link TOOLBAR_ITEM_SELECTORS}, `'*'` recursion). Counting via
   * `childListHelper`'s `:nth-child` exists-walk is portable, unlike a
   * `getAttribute(..., true).length` read (Playwright drops attribute-less
   * matches, jsdom keeps them). Caveat: a toolbar item that is itself a composite
   * containing nested focusable controls (e.g. a `Popover` with its hidden close
   * button) counts those too.
   */
  async getItemCount(): Promise<number> {
    const counts = await Promise.all(
      TOOLBAR_ITEM_SELECTORS.map(selector =>
        childListHelper.countMatchingChildren(this.interactor, this.locator, selector, '*')
      )
    );
    return counts.reduce((total, count) => total + count, 0);
  }

  override get driverName(): string {
    return 'AstryxToolbarDriver';
  }
}
