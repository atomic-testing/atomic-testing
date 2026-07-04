import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  byRole,
  childListHelper,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  locatorUtil,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';
import { MenuItemDriver } from './MenuItemDriver';

export const selectParts = {
  /**
   * `Select.Content` — `role="listbox"`, a direct `document.body` child (not
   * wrapped in a popper wrapper, per the module doc's DOM audit), reached with a
   * `'Root'`-relative locator declared directly on this child part rather than
   * via the static `overriddenParentLocator` hooks `DialogDriver`/
   * `DropdownMenuDriver` use — mirroring how `component-driver-mui-v7`'s
   * `SelectDriver` reaches its own portalled `dropdown` part. This driver's own
   * root locator stays the in-tree trigger, so the class-level static hooks
   * would re-root EVERY part (including the trigger-scoped reads below), not
   * just the dropdown — a per-part 'Root' locator is the more surgical tool
   * here. Like `DropdownMenuDriver`, only one open listbox is assumed at a time
   * (Radix, like MUI, gives no id link disambiguating multiple simultaneously
   * open listboxes).
   */
  dropdown: {
    locator: byRole('listbox', 'Root'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/** CSS for a Radix select option — the ARIA role, never a Tailwind/shadcn class. */
const optionSelector = '[role="option"]';

/**
 * `Select.Viewport` (`[data-radix-select-viewport]`) is the DIRECT parent of
 * `Select.Item`s — `Select.Content` itself is not (it also wraps a scrollbar and
 * the viewport), so item iteration must walk the viewport's children, not the
 * listbox's. `data-radix-select-viewport` is Radix's own structural marker
 * (never a Tailwind/shadcn class), the same tier as `data-radix-popper-content-wrapper`
 * documented for the other portalled primitives.
 */
function viewportLocator(dropdown: PartLocator): PartLocator {
  return locatorUtil.append(dropdown, byCssSelector('[data-radix-select-viewport]'));
}

export interface SelectItemGetOption {
  /** When true, skip the open-dropdown check to save a round trip. */
  skipDropdownCheck?: boolean;
}

/**
 * Driver for a Radix `Select` (`Select.Root`/`Select.Trigger` from `radix-ui`)
 * — the flagship pain point of this wave.
 *
 * **The `hasPointerCapture` jsdom gap** (this documentation IS the fix's value
 * proposition, per #1003): `Select.Trigger`'s `onPointerDown` handler
 * unconditionally calls `target.hasPointerCapture(event.pointerId)` before
 * opening (to release a stray capture Radix itself may have set — see
 * `@radix-ui/react-select`'s `SelectTrigger`). jsdom does not implement the
 * Pointer Events capture methods at all (`Element.prototype.hasPointerCapture`
 * is simply absent — https://github.com/jsdom/jsdom/issues/2527), so the very
 * first click on ANY Radix Select throws `target.hasPointerCapture is not a
 * function` under jsdom and the dropdown never opens — a harder failure than
 * the "opens then immediately closes" framing suggests; nothing opens at all.
 * A second, independent jsdom gap (`scrollIntoView`, called by
 * `Select.ItemText` to keep the highlighted item in view on open) throws the
 * same way immediately after. **The fix is a jsdom-only polyfill**, not a
 * driver-level workaround: `package-tests/component-driver-radix-test/jest.setup.ts`
 * stubs `hasPointerCapture`/`setPointerCapture`/`releasePointerCapture` (return
 * `false`/no-op, matching jsdom's real "never actually captures a pointer"
 * behavior) and `scrollIntoView` (no-op; jsdom has no layout to scroll). Real
 * browsers implement the full Pointer Events + scroll APIs natively — this gap
 * and its fix are jsdom-only, verified against the chromium E2E run.
 *
 * **No `data-value` on `Select.Item`** (the #923 decision, already recorded in
 * `agent-docs/modules/component-driver-radix.md`): unlike MUI, Radix does not
 * render the `value` prop as a DOM attribute anywhere — the only portably
 * readable identity for an item is its VISIBLE LABEL. `getValue`/`setValue`
 * therefore operate on that label (not an underlying `value`, unlike MUI's
 * `data-value`-backed `SelectDriver`); `getSelectedLabel`/`selectByLabel` are
 * the primary, unambiguously-named surface, mirroring how #923 already commits
 * every Radix driver in this epic to `getText`-based item matching instead of
 * accname/value resolution.
 *
 * **Reading the selected label excludes the icon**: `Select.Icon` with no
 * children (this driver's test scene, and Radix's own docs example) renders a
 * default "▼" glyph as a `<span aria-hidden="true">`, a sibling of
 * `Select.Value`'s span inside the trigger — both are plain `<span>`s with no
 * other distinguishing attribute. A whole-trigger `getText()` would therefore
 * read `"Apple▼"`. `getSelectedLabel` instead reads only the trigger's direct
 * child `span` that is NOT `aria-hidden`, mirroring what real accessible-name
 * computation does (skip `aria-hidden` branches) without needing the
 * accname-aware `findByRole` #923 deferred.
 */
export class SelectDriver extends ComponentDriver<typeof selectParts> implements IInputDriver<string | null> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: selectParts,
    });
  }

  /** Whether the dropdown is open — read from the trigger's Radix `data-state`. */
  async isDropdownOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-state')) === 'open';
  }

  /** Open the dropdown by clicking the trigger, if not already open. */
  async openDropdown(): Promise<void> {
    if (await this.isDropdownOpen()) {
      return;
    }
    await this.click();
  }

  /** Close the dropdown by clicking the trigger, if open. */
  async closeDropdown(): Promise<void> {
    if (!(await this.isDropdownOpen())) {
      return;
    }
    await this.click();
  }

  /** The trigger's visible selected-value text, excluding the decorative icon (see class doc). */
  async getSelectedLabel(): Promise<string | null> {
    const valueLocator = locatorUtil.append(this.locator, byCssSelector('> span:not([aria-hidden="true"])'));
    const label = await this.interactor.getText(valueLocator);
    return label?.trim() || null;
  }

  /** Alias for {@link getSelectedLabel} — satisfies `IInputDriver`. See class doc for why "value" is the label here. */
  async getValue(): Promise<string | null> {
    return this.getSelectedLabel();
  }

  /**
   * Select the item whose visible label matches `value`, if it exists.
   * @returns `false` when no such item exists (does not throw — see {@link selectByLabel} for the throwing variant).
   */
  async setValue(value: string | null): Promise<boolean> {
    if (value == null) {
      return false;
    }
    const item = await this.getMenuItemByLabel(value);
    if (item == null) {
      return false;
    }
    await item.click();
    return true;
  }

  /**
   * The item whose visible label matches `label`, or `null` when absent. Opens
   * the dropdown first unless `option.skipDropdownCheck` is set.
   */
  async getMenuItemByLabel(label: string, option?: SelectItemGetOption): Promise<MenuItemDriver | null> {
    if (!option?.skipDropdownCheck) {
      await this.openDropdown();
    }
    const container = viewportLocator(this.parts.dropdown.locator);
    // childListHelper's `host` parameter is a bare `ComponentDriver` (no type
    // param), so a driver like this one with its own non-empty `parts` (the
    // `dropdown` part) fails structural assignability on `getMissingPartNames`'s
    // return type — the same "intentional variance" gap CLAUDE.md documents for
    // `ComponentDriverClass<T extends ComponentDriver<any>>`. `interactor` and
    // `commutableOption`, the only members `iterateMatchingChildren` actually
    // reads, are unaffected by the cast.
    for await (const item of childListHelper.iterateMatchingChildren(
      this as ComponentDriver<any>,
      container,
      optionSelector,
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
    await this.openDropdown();
    const item = await this.getMenuItemByLabel(label, { skipDropdownCheck: true });
    if (item) {
      await item.click();
    } else {
      throw new MenuItemNotFoundError(label, this);
    }
  }

  /** The number of options in the open dropdown. */
  async getMenuItemCount(): Promise<number> {
    const container = viewportLocator(this.parts.dropdown.locator);
    return childListHelper.countMatchingChildren(this.interactor, container, optionSelector);
  }

  /** The option at the given zero-based index, or `null` if out of range. */
  async getMenuItemByIndex(index: number): Promise<MenuItemDriver | null> {
    const container = viewportLocator(this.parts.dropdown.locator);
    let position = 0;
    // childListHelper's `host` parameter is a bare `ComponentDriver` (no type
    // param), so a driver like this one with its own non-empty `parts` (the
    // `dropdown` part) fails structural assignability on `getMissingPartNames`'s
    // return type — the same "intentional variance" gap CLAUDE.md documents for
    // `ComponentDriverClass<T extends ComponentDriver<any>>`. `interactor` and
    // `commutableOption`, the only members `iterateMatchingChildren` actually
    // reads, are unaffected by the cast.
    for await (const item of childListHelper.iterateMatchingChildren(
      this as ComponentDriver<any>,
      container,
      optionSelector,
      MenuItemDriver
    )) {
      if (position === index) {
        return item;
      }
      position++;
    }
    return null;
  }

  /** Whether the trigger is disabled — Radix mirrors this as `aria-disabled`/`data-disabled`. */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  /** Whether the trigger is marked required (`aria-required`, set when `Select.Root`'s `required` prop is true). */
  async isRequired(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-required')) === 'true';
  }

  get driverName(): string {
    return 'RadixV1SelectDriver';
  }
}
