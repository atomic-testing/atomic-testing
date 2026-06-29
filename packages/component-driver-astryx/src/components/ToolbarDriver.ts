import { byTagName, ComponentDriver, locatorUtil, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx Toolbar (`@astryxdesign/core/Toolbar`).
 *
 * Toolbar's DOM root is a section `<div>` with no role; the semantic element is an
 * inner `<div role="toolbar">` that is also where `data-testid` lands (Toolbar
 * spreads unknown props there) — so the scene anchors that inner div by testid or
 * by `byRole('toolbar')`, and this driver reads its accessible name
 * (`aria-label`), orientation (`aria-orientation`), and size (`data-size`)
 * straight off the root locator. Items live in slot wrappers; the button count is
 * read as a descendant tag query.
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
   * Number of button items in the toolbar, counted as descendant `<button>`s via
   * their `type` attribute. The multi-`getAttribute` length is the count only when
   * the attribute is present on every match (Playwright drops null entries), which
   * holds for Astryx buttons (always `type="button"`).
   */
  async getItemCount(): Promise<number> {
    const buttons = locatorUtil.append(this.locator, byTagName('button'));
    return (await this.interactor.getAttribute(buttons, 'type', true)).length;
  }

  override get driverName(): string {
    return 'AstryxToolbarDriver';
  }
}
