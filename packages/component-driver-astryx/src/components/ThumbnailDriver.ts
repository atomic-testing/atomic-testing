import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx Thumbnail (`@astryxdesign/core/Thumbnail`) — a small media
 * preview with loading, placeholder, and removable states.
 *
 * The root is a `<div class="astryx-thumbnail">` (no role) that self-emits
 * `data-testid`; its `aria-label` is a composite accessible name (`"{label} —
 * {alt}"`, `"{label} — placeholder"` when there is no `src`, or `"Loading"` while
 * loading). The inner content is conditional: an `<img>` when `src` is set, a
 * `<div class="astryx-skeleton">` while loading, or a person `<svg>` placeholder
 * otherwise. A removable thumbnail also renders a `Remove …` button.
 *
 * The hover tooltip (a sibling `popover` element) and the click-to-open lightbox
 * preview (a portal) are presentational/interactive behaviors that only manifest
 * in a real browser (E2E); they are not modeled here.
 */
export class ThumbnailDriver extends ComponentDriver<{}> {
  /** The inner image, present only when a `src` was supplied. */
  private get image(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('img'));
  }

  /** The loading skeleton, present only while `isLoading`. */
  private get skeleton(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('.astryx-skeleton'));
  }

  /** The remove control, present only on a removable thumbnail. */
  private get removeButton(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('button[aria-label^="Remove"]'));
  }

  /** The composite accessible name — the verbatim `aria-label`. */
  async getAccessibleName(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** The image source, or `undefined` when there is no `src` (placeholder/loading). */
  async getImageSrc(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(this.image))) {
      return undefined;
    }
    return this.interactor.getAttribute(this.image, 'src');
  }

  /** Whether the thumbnail is in its loading state — it renders a skeleton instead of content. */
  async isLoading(): Promise<boolean> {
    return this.interactor.exists(this.skeleton);
  }

  /** Whether the thumbnail is a placeholder — neither an image nor a loading skeleton is present. */
  async isPlaceholder(): Promise<boolean> {
    return !(await this.interactor.exists(this.image)) && !(await this.interactor.exists(this.skeleton));
  }

  /** Whether the thumbnail exposes a remove control. */
  async canRemove(): Promise<boolean> {
    return this.interactor.exists(this.removeButton);
  }

  get driverName(): string {
    return 'AstryxThumbnailDriver';
  }
}
