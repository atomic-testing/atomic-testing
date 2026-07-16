import {
  byCssSelector,
  childListHelper,
  ComponentDriver,
  IDisableableDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { InteractionTagDriver } from './InteractionTagDriver';
import { TagDriver } from './TagDriver';

// A single `:is(...)`-wrapped compound, not a bare comma list — same reasoning
// as `MenuDriver`'s `menuItemSelector`: `childListHelper` appends `:nth-child(n)`
// directly after this string, and a bare comma list would bind the suffix only
// to the last branch, breaking positional counting across the two tag kinds.
const anyTagSelector = ':is(.fui-Tag, .fui-InteractionTag)';
const plainTagSelector = '.fui-Tag';
const interactionTagSelector = '.fui-InteractionTag';

/** Locator for the group's `position`-th child (1-based), if it matches `childSelector`. */
function childAt(container: PartLocator, childSelector: string, position: number): PartLocator {
  return locatorUtil.append(container, byCssSelector(`> ${childSelector}:nth-child(${position})`));
}

/** Locator for the group's `position`-th element child (any element), used to detect the walk's end. */
function anyChildAt(container: PartLocator, position: number): PartLocator {
  return locatorUtil.append(container, byCssSelector(`> *:nth-child(${position})`));
}

/**
 * Driver for a Fluent v9 `TagGroup` — a container of `Tag` and/or
 * `InteractionTag` children.
 *
 * DOM audit (@fluentui/react-components@9.74.3): the `data-testid`/locator you
 * put on `<TagGroup>` forwards straight to its own root `<div class="fui-TagGroup">`,
 * so the scene's own locator is this driver's locator directly (no re-root
 * needed — `TagGroup` never portals). Its ARIA `role` is NOT a fixed, intrinsic
 * value the way it is for e.g. `Divider`'s `role="separator"` — Fluent defaults
 * it to `role="toolbar"` but it is a genuinely consumer-settable prop (verified
 * against Fluent's own source: `role = 'toolbar'` destructured straight off
 * `props`, no dedicated enum/"layout" prop backing the commonly-documented
 * `role="list"` mode), so this driver deliberately does NOT anchor anything on
 * it, and does not expose a `getRole()` — a caller can set literally any ARIA
 * role.
 *
 * `Tag` (`<span class="fui-Tag">`) and `InteractionTag`
 * (`<div class="fui-InteractionTag">`) can be mixed as direct siblings inside
 * one group (verified against rendered DOM), so item enumeration walks
 * positionally via `childListHelper`'s `:nth-child` technique (see `MenuDriver`)
 * rather than assuming one child shape, and {@link getTagByIndex} returns
 * whichever concrete driver actually matches that position.
 *
 * `aria-disabled` is the one state `TagGroup` DOES stamp unconditionally on
 * its own root (`useTagGroupBase_unstable` always sets it, mirroring the
 * `disabled` prop) — contrast `Tag`, whose OWN `disabled` prop has no DOM
 * reflection at all (see `TagDriver`'s Known Gap) — so `isDisabled` here reads
 * that root attribute directly rather than delegating to the generic
 * `Interactor.isDisabled` (which only recognizes the native `disabled` IDL
 * property, absent on a plain `<div>`).
 */
export class TagGroupDriver extends ComponentDriver<{}> implements IDisableableDriver {
  /** Whether the group (and, by Fluent's cascade, every tag inside it) is disabled. */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  /** The number of `Tag`/`InteractionTag` children (mixed or uniform), `0` for an empty group. */
  async getTagCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, anyTagSelector);
  }

  /** Every child's visible label, in DOM order (see {@link TagDriver.getLabel}/{@link InteractionTagDriver.getLabel}). */
  async getTagLabels(): Promise<readonly Optional<string>[]> {
    const labels: Optional<string>[] = [];
    for await (const tag of this.iterateTags()) {
      labels.push(await tag.getLabel());
    }
    return labels;
  }

  /** The tag at the given zero-based index, or `null` when out of range. Returns whichever concrete driver matches that position. */
  async getTagByIndex(index: number): Promise<TagDriver | InteractionTagDriver | null> {
    let position = 0;
    for await (const tag of this.iterateTags()) {
      if (position === index) {
        return tag;
      }
      position++;
    }
    return null;
  }

  /** Walk direct children positionally, yielding a {@link TagDriver} or {@link InteractionTagDriver} per matching child. */
  private async *iterateTags(): AsyncGenerator<TagDriver | InteractionTagDriver> {
    for (let position = 1; await this.interactor.exists(anyChildAt(this.locator, position)); position++) {
      const plainLocator = childAt(this.locator, plainTagSelector, position);
      if (await this.interactor.exists(plainLocator)) {
        yield new TagDriver(plainLocator, this.interactor, this.commutableOption);
        continue;
      }
      const interactionLocator = childAt(this.locator, interactionTagSelector, position);
      if (await this.interactor.exists(interactionLocator)) {
        yield new InteractionTagDriver(interactionLocator, this.interactor, this.commutableOption);
      }
    }
  }

  get driverName(): string {
    return 'FluentV9TagGroupDriver';
  }
}
