import { byCssClass, ComponentDriver, locatorUtil, Optional } from '@atomic-testing/core';

import { readOptionalDescendantText } from '../internal/optionalText';
import { AvatarDriver } from './AvatarDriver';
import { PresenceBadgeDriver } from './PresenceBadgeDriver';

const avatarLocator = byCssClass('fui-Persona__avatar');
const presenceLocator = byCssClass('fui-Persona__presence');
const primaryTextLocator = byCssClass('fui-Persona__primaryText');
const secondaryTextLocator = byCssClass('fui-Persona__secondaryText');
const tertiaryTextLocator = byCssClass('fui-Persona__tertiaryText');

/**
 * Driver for the Fluent v9 `Persona` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders
 * `<div class="fui-Persona">` with the avatar (`fui-Persona__avatar`) and
 * text lines (`fui-Persona__primaryText`/`__secondaryText`/`__tertiaryText`)
 * as true descendants — the inherited whole-root `getText()` would
 * concatenate the avatar's own text (its initials) together with every text
 * line, so this driver reads each line off its own structural class instead.
 * `presenceOnly` swaps the avatar slot for a bare `PresenceBadge`
 * (`fui-Persona__presence`); {@link getPresenceBadge} reaches that slot
 * directly rather than requiring callers to fish it out of `getAvatar()`'s
 * own nested badge, which is unset in `presenceOnly` mode.
 */
export class PersonaDriver extends ComponentDriver<{}> {
  /** The `Avatar` this persona renders, when not in `presenceOnly` mode. */
  getAvatar(): AvatarDriver {
    return new AvatarDriver(locatorUtil.append(this.locator, avatarLocator), this.interactor, this.commutableOption);
  }

  /** The standalone `PresenceBadge` this persona renders in `presenceOnly` mode. */
  getPresenceBadge(): PresenceBadgeDriver {
    return new PresenceBadgeDriver(
      locatorUtil.append(this.locator, presenceLocator),
      this.interactor,
      this.commutableOption
    );
  }

  /** The first (largest) line of text, or `undefined` when rendered without one. */
  async getPrimaryText(): Promise<Optional<string>> {
    return readOptionalDescendantText(this.interactor, this.locator, primaryTextLocator);
  }

  /** The second line of text, or `undefined` when rendered without one. */
  async getSecondaryText(): Promise<Optional<string>> {
    return readOptionalDescendantText(this.interactor, this.locator, secondaryTextLocator);
  }

  /** The third line of text, or `undefined` when rendered without one. */
  async getTertiaryText(): Promise<Optional<string>> {
    return readOptionalDescendantText(this.interactor, this.locator, tertiaryTextLocator);
  }

  get driverName(): string {
    return 'FluentV9PersonaDriver';
  }
}
