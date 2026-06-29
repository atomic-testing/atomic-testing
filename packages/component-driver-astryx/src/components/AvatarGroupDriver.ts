import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx AvatarGroup (`@astryxdesign/core/AvatarGroup`) — a
 * clustered row of {@link AvatarDriver | Avatar}s with an optional overflow count.
 *
 * The root is a `<div role="group" aria-label="Avatars">` (the label is hardcoded,
 * not configurable) that self-emits `data-testid`. Each visible avatar is a
 * descendant `[role="img"]` carrying its own `aria-label` (its accessible name);
 * an optional overflow chip is a `<span class="astryx-avatar-group-overflow">`
 * whose `aria-label` reads `"{n} more"` (it is neither `role="img"` nor testid'd).
 *
 * Because every avatar always carries an `aria-label`, reading them with the
 * multi-element `getAttribute(..., true)` is faithful (and a reliable count) in
 * both jsdom and the browser — no null entries are dropped.
 */
export class AvatarGroupDriver extends ComponentDriver<{}> {
  /** Every visible avatar within the group. */
  private get avatars(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('[role="img"]'));
  }

  /** The overflow chip, present only when avatars were collapsed. */
  private get overflow(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('.astryx-avatar-group-overflow'));
  }

  /** The number of avatars actually rendered (excludes the overflow chip). */
  async getVisibleCount(): Promise<number> {
    return (await this.getAvatarNames()).length;
  }

  /** Each visible avatar's accessible name (`aria-label`), in DOM order. */
  async getAvatarNames(): Promise<readonly string[]> {
    return this.interactor.getAttribute(this.avatars, 'aria-label', true);
  }

  /**
   * The count of hidden avatars, parsed from the overflow chip's
   * `aria-label` (`"{n} more"`). `undefined` when there is no overflow.
   */
  async getOverflowCount(): Promise<Optional<number>> {
    if (!(await this.interactor.exists(this.overflow))) {
      return undefined;
    }
    const ariaLabel = await this.interactor.getAttribute(this.overflow, 'aria-label');
    const match = ariaLabel?.match(/(\d+)\s+more/);
    return match ? Number(match[1]) : undefined;
  }

  get driverName(): string {
    return 'AstryxAvatarGroupDriver';
  }
}
