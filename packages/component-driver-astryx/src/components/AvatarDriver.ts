import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { resolveDescribedByRoleText } from '../internal/linkedLocators';

/**
 * Driver for the Astryx Avatar (`@astryxdesign/core/Avatar`) — a user/entity
 * thumbnail with initials and icon fallbacks.
 *
 * Avatar renders a `<div role="img">` (self-anchoring `data-testid`) whose
 * accessible name is the `aria-label` (`alt || name || 'Avatar'`) and whose size
 * is `data-size`. The inner content is conditional: an `<img>` when `src` is set,
 * otherwise the initials text (from `name`) or a person `<svg>` icon.
 *
 * NOTE: jsdom always materialises the `<img>` for a given `src` and never fires
 * its `onError`, so {@link hasImage} here means "a `src` was supplied", not
 * "the image loaded". The load-failure → initials fallback is therefore only
 * observable in a real browser (E2E).
 */
export class AvatarDriver extends ComponentDriver<{}> {
  /** The inner image, present only when a `src` was supplied. */
  private get image(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('img'));
  }

  /**
   * The hover/focus tooltip's text (Astryx 0.1.9's `tooltip` prop), or
   * `undefined` when absent. **Only a custom string `tooltip` is readable
   * here** — Astryx wires `aria-describedby` for that case only; the default
   * name tooltip (`tooltip` omitted or `true`) is visual-only and deliberately
   * *not* `aria-describedby`-linked (its text just duplicates {@link getAccessibleName},
   * so describing it too would double-announce the name). Read the name via
   * {@link getAccessibleName}/{@link getInitials} instead. The tooltip's own
   * visibility is E2E-only (a native popover); this reads its content, mounted
   * or not.
   */
  async getTooltipText(): Promise<Optional<string>> {
    return resolveDescribedByRoleText(this.interactor, this.locator, 'aria-describedby', 'tooltip');
  }

  /** The accessible name — the verbatim `aria-label` (`alt`, else `name`, else `'Avatar'`). */
  async getAccessibleName(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** The image source, or `undefined` when no `src` was supplied (initials/icon fallback). */
  async getImageSrc(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(this.image))) {
      return undefined;
    }
    return this.interactor.getAttribute(this.image, 'src');
  }

  /** Whether a `src` was supplied (see class note on jsdom vs. load-failure semantics). */
  async hasImage(): Promise<boolean> {
    return this.interactor.exists(this.image);
  }

  /**
   * The initials shown when there is no image — the root's text. `undefined`
   * when an image is present (no initials are rendered).
   */
  async getInitials(): Promise<Optional<string>> {
    if (await this.interactor.exists(this.image)) {
      return undefined;
    }
    return (await this.getText())?.trim() || undefined;
  }

  /**
   * The avatar size (`data-size`): `'xsm'`, `'sm'`, `'md'` (default), `'lg'`,
   * `'xl'`. Astryx 0.1.8 renamed this scale from `'tiny'`/`'xsmall'`/`'small'`/
   * `'medium'`/`'large'` — this read is a passthrough of the raw attribute, so
   * it is unaffected either way; only the values it returns changed.
   */
  async getSize(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-size');
  }

  get driverName(): string {
    return 'AstryxAvatarDriver';
  }
}
