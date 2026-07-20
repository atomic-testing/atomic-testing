import { byCssClass, ComponentDriver, locatorUtil } from '@atomic-testing/core';

import { AvatarDriver } from './AvatarDriver';

const avatarLocator = byCssClass('fui-Avatar');

/**
 * Driver for a single `AvatarGroupItem` (see {@link AvatarGroupDriver}).
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders
 * `<div class="fui-AvatarGroupItem">` wrapping exactly one `Avatar`. This
 * wrapper carries no state of its own beyond the avatar it holds, so this
 * driver's only job is handing back that nested {@link AvatarDriver} rather
 * than duplicating its `getName`/`getInitials`/`getPresenceBadge` surface.
 */
export class AvatarGroupItemDriver extends ComponentDriver<{}> {
  /** The `Avatar` this group item wraps. */
  getAvatar(): AvatarDriver {
    return new AvatarDriver(locatorUtil.append(this.locator, avatarLocator), this.interactor, this.commutableOption);
  }

  get driverName(): string {
    return 'FluentV9AvatarGroupItemDriver';
  }
}
