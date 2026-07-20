import { byCssClass, ComponentDriver, locatorUtil, Optional } from '@atomic-testing/core';

import { readOptionalDescendantText } from '../internal/optionalText';
import { PresenceBadgeDriver } from './PresenceBadgeDriver';

const initialsLocator = byCssClass('fui-Avatar__initials');
const badgeLocator = byCssClass('fui-Avatar__badge');

/**
 * Driver for the Fluent v9 `Avatar` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders
 * `<span role="img" aria-label="{name}">`, whose `aria-label` carries the
 * `name` prop regardless of whether a `badge` is also supplied (a `badge`
 * only adds an `aria-labelledby` pointing at both this span and the badge —
 * it does not replace `aria-label`), so {@link getName} is a single reliable
 * read either way. When there is no `image`, the initials render as a plain
 * `<span class="fui-Avatar__initials">` child; a supplied `badge` (always a
 * `PresenceBadge`) renders as `<... class="fui-Avatar__badge">`, reachable
 * via {@link getPresenceBadge} as a real nested driver rather than a
 * duplicated status reader.
 */
export class AvatarDriver extends ComponentDriver<{}> {
  /** The avatar's accessible name (the `name` prop), read from `aria-label`. */
  async getName(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** The rendered initials, or `undefined` when an `image` is shown instead. */
  async getInitials(): Promise<Optional<string>> {
    return readOptionalDescendantText(this.interactor, this.locator, initialsLocator);
  }

  /**
   * The nested `PresenceBadge` driver for this avatar's `badge` slot. Check
   * `(await getPresenceBadge().exists())` before reading status — most
   * avatars render no badge at all.
   */
  getPresenceBadge(): PresenceBadgeDriver {
    return new PresenceBadgeDriver(
      locatorUtil.append(this.locator, badgeLocator),
      this.interactor,
      this.commutableOption
    );
  }

  get driverName(): string {
    return 'FluentV9AvatarDriver';
  }
}
