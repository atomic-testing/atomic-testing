import {
  childListHelper,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';
import { menuListLocator } from '../internal/menuLocators';
import { MenuItemCheckboxDriver } from './MenuItemCheckboxDriver';
import { MenuItemDriver } from './MenuItemDriver';
import { MenuItemRadioDriver } from './MenuItemRadioDriver';

// A single `:is(...)`-wrapped compound, NOT a bare comma list: childListHelper
// appends `:nth-child(n)` directly after this string (`${childSelector}:nth-child(n)`),
// and CSS commas create independent selector branches — the `:nth-child`
// suffix would then bind only to the LAST branch, silently breaking positional
// matching for the other two roles. `:is()` keeps the three roles as one
// selector so the suffix applies to all of them; supported by jsdom's nwsapi
// and all three Playwright engines (same tier as the `:has()` support this
// repo already relies on elsewhere).
const menuItemSelector = ':is([role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"])';
const menuItemCheckboxSelector = '[role="menuitemcheckbox"]';
const menuItemRadioSelector = '[role="menuitemradio"]';
const defaultTransitionDuration = 1000;

/**
 * Driver for a Fluent v9 `Menu` (`MenuTrigger` + `MenuPopover`/`MenuList`/
 * `MenuItem*`), constructed from the SCENE-supplied TRIGGER locator rather than
 * the portalled content — see `../internal/menuLocators.ts` for why: the
 * content's `role="menu"` is identical across every simultaneously open menu,
 * so this driver instead follows the trigger's `id` → the menu's
 * `aria-labelledby` link, re-resolved fresh on every call, which correctly
 * disambiguates two open menus (verified against rendered DOM).
 *
 * Item iteration uses `childListHelper` rather than a plain `:nth-of-type`
 * walk: Fluent interleaves non-item children (leading/trailing focus-trap
 * `<i data-tabster-dummy>` elements) among the `MenuItem`/`MenuItemCheckbox`/
 * `MenuItemRadio` children — `:nth-of-type` would miscount past them (the
 * `childListHelper` stale-pattern trap CLAUDE.md documents), while
 * `childListHelper`'s `:nth-child` + selector filter skips them without losing
 * position.
 */
export class MenuDriver<ContentT extends ScenePart = {}> extends ContainerDriver<ContentT, {}> {
  /** The scene-supplied trigger locator (the element `MenuTrigger` clones `aria-haspopup`/`id` onto). */
  protected readonly triggerLocator: PartLocator;

  constructor(
    triggerLocator: PartLocator,
    interactor: Interactor,
    option?: Partial<IContainerDriverOption<ContentT, {}>>
  ) {
    super(menuListLocator(triggerLocator), interactor, {
      ...option,
      parts: {},
      content: (option?.content ?? {}) as ContentT,
    });
    this.triggerLocator = triggerLocator;
  }

  /**
   * Whether the menu is open. Unlike a Radix-style `aria-controls` link (absent
   * while closed, so resolving it throws), the trigger's `id` — the attribute
   * this driver's content locator extracts — is always present, so the
   * underlying query is always well-formed and simply matches nothing while
   * closed; plain `exists()` is therefore safe to use directly.
   */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  /** Open the menu by clicking its trigger, if not already open. */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.interactor.click(this.triggerLocator);
    }
  }

  /** Close the menu by clicking its trigger, if open. */
  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.interactor.click(this.triggerLocator);
    }
  }

  /** Wait for the menu to open (its list to mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the menu to close (its list to unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  /**
   * Dismiss the menu by pressing `Escape`, then wait for it to close.
   * Whether it actually closes depends on the consumer honoring the dismissal;
   * the returned boolean reflects the observed close, not merely the key press.
   *
   * **Escape dismisses the topmost stacked overlay, not necessarily THIS
   * one**: verified against real Chromium — with two simultaneously open
   * menus, `Escape` closes only the most-recently-opened one, regardless of
   * which menu's locator the key event is dispatched on (Fluent's dismiss
   * handling is a global, stack-ordered listener, not per-element). Call this
   * on the LAST-opened instance when driving a stacked scenario.
   */
  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.isOpen()) {
      await this.interactor.pressKey(this.locator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  /** The item whose visible label matches `label`, or `null` when absent (matches plain, checkbox, and radio items alike). */
  async getMenuItemByLabel(label: string): Promise<MenuItemDriver | null> {
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      menuItemSelector,
      MenuItemDriver
    )) {
      const itemLabel = await item.getLabel();
      if (itemLabel === label) {
        return item;
      }
    }
    return null;
  }

  /** Click the item whose visible label matches `label`. @throws {MenuItemNotFoundError} when absent. */
  async selectByLabel(label: string): Promise<void> {
    const item = await this.getMenuItemByLabel(label);
    if (item) {
      await item.click();
    } else {
      throw new MenuItemNotFoundError(label, this);
    }
  }

  /** The number of items (plain, checkbox, and radio) in the open menu. */
  async getMenuItemCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, menuItemSelector);
  }

  /** The item at the given zero-based index, or `null` if out of range. */
  async getMenuItemByIndex(index: number): Promise<MenuItemDriver | null> {
    let position = 0;
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      menuItemSelector,
      MenuItemDriver
    )) {
      if (position === index) {
        return item;
      }
      position++;
    }
    return null;
  }

  /** The `MenuItemCheckbox` whose visible label matches `label`, or `null` when absent. */
  async getCheckboxItemByLabel(label: string): Promise<MenuItemCheckboxDriver | null> {
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      menuItemCheckboxSelector,
      MenuItemCheckboxDriver
    )) {
      if ((await item.getLabel()) === label) {
        return item;
      }
    }
    return null;
  }

  /** The `MenuItemRadio` whose visible label matches `label`, or `null` when absent. */
  async getRadioItemByLabel(label: string): Promise<MenuItemRadioDriver | null> {
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      menuItemRadioSelector,
      MenuItemRadioDriver
    )) {
      if ((await item.getLabel()) === label) {
        return item;
      }
    }
    return null;
  }

  get driverName(): string {
    return 'FluentV9MenuDriver';
  }
}
