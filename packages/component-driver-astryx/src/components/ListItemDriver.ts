import { byTagName, ComponentDriver, locatorUtil, Optional } from '@atomic-testing/core';

/**
 * Driver for a single Astryx List row (`<li>` inside a `<ul>`/`<ol>`).
 *
 * Astryx renders each `ListItem` as an `<li>` whose label (and optional
 * description) live in nested `<span>`s; an interactive item wraps its content in
 * an invisible `<a href>` (link) or `<button>` (`onClick`), and the `<li>` itself
 * carries the row state — `aria-selected="true"` when selected and
 * `aria-disabled="true"` when disabled (never the native `disabled` attribute,
 * since `<li>` is not a form control). State is therefore read from ARIA on the
 * row, never from StyleX-hashed classes.
 *
 * {@link getLabel} returns the row's full visible text (trimmed). When an item has
 * a `description`, that text is included after the label — mirroring the MUI
 * `ListItemDriver` — so assert against label-only rows when a clean label is
 * required.
 */
export class ListItemDriver extends ComponentDriver {
  /** The row's visible text (label, plus description when present), trimmed. */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText())?.trim() || undefined;
  }

  /** Whether the row is selected — Astryx marks this with `aria-selected="true"`. */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-selected')) === 'true';
  }

  /** Whether the row is disabled — Astryx marks this with `aria-disabled="true"`. */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  /** Whether the row is a link — it renders an `<a href>` when given an `href`. */
  async isLink(): Promise<boolean> {
    return this.interactor.exists(locatorUtil.append(this.locator, byTagName('a')));
  }

  /** The row's link target, or `undefined` when it is not a link. */
  async getHref(): Promise<Optional<string>> {
    return this.interactor.getAttribute(locatorUtil.append(this.locator, byTagName('a')), 'href');
  }

  override get driverName(): string {
    return 'AstryxListItemDriver';
  }
}
