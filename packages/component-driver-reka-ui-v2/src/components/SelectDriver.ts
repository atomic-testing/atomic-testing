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
   * `SelectContent` — `role="listbox"`, a direct `document.body` child (its
   * `SelectPortal` teleports `to: 'body'` by default, per the module doc's DOM
   * audit), reached with a `'Root'`-relative locator declared directly on this
   * child part rather than via the static `overriddenParentLocator` hooks
   * `DropdownMenuDriver` uses — mirroring how `component-driver-radix-v1`'s
   * `SelectDriver` reaches its own portalled `dropdown` part. This driver's own
   * root locator stays the in-tree trigger, so the class-level static hooks
   * would re-root EVERY part (including the trigger-scoped reads below), not
   * just the dropdown — a per-part 'Root' locator is the more surgical tool
   * here. Like `DropdownMenuDriver`, only one open listbox is assumed at a time
   * (Reka, like Radix, gives no id link disambiguating multiple simultaneously
   * open listboxes).
   */
  dropdown: {
    locator: byRole('listbox', 'Root'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/** CSS for a Reka select option — the ARIA role, never a Tailwind/shadcn class. */
const optionSelector = '[role="option"]';

/**
 * `SelectViewport` (`[data-reka-select-viewport]`) is the DIRECT parent of
 * `SelectItem`s — `SelectContent` itself is not (its inner position wrapper
 * also renders the scroll-up/-down buttons alongside the viewport), so item
 * iteration must walk the viewport's children, not the listbox's.
 * `data-reka-select-viewport` is Reka's own structural marker (verified against
 * `reka-ui@2.10.1`'s `Select/SelectViewport.vue` template and the rendered DOM
 * — a boolean, presence-only attribute, never a Tailwind/shadcn class), the
 * Reka-renamed counterpart of Radix's `data-radix-select-viewport`.
 */
function viewportLocator(dropdown: PartLocator): PartLocator {
  return locatorUtil.append(dropdown, byCssSelector('[data-reka-select-viewport]'));
}

export interface SelectItemGetOption {
  /** When true, skip the open-dropdown check to save a round trip. */
  skipDropdownCheck?: boolean;
}

/**
 * Driver for a Reka `Select` (`SelectRoot`/`SelectTrigger` from `reka-ui`) —
 * the flagship pain point of this porting wave.
 *
 * **The `hasPointerCapture` jsdom gap** (this documentation IS the fix's value
 * proposition, per #1037, mirroring #1003 for Radix): `SelectTrigger`'s
 * `onPointerDown` handler (`reka-ui`'s `Select/SelectTrigger.vue`)
 * unconditionally calls `target.hasPointerCapture(event.pointerId)` before
 * opening (to release a stray capture Reka itself may have set). jsdom does
 * not implement the Pointer Events capture methods at all
 * (`Element.prototype.hasPointerCapture` is simply absent —
 * https://github.com/jsdom/jsdom/issues/2527), so the very first click on ANY
 * Reka `Select` throws `target.hasPointerCapture is not a function` under
 * jsdom and the dropdown never opens — confirmed by rendering the real
 * component under jsdom before writing this driver (see this package's
 * `jest.setup.ts` for the exact error reproduced). **The fix is a jsdom-only
 * polyfill**, not a driver-level workaround: this test package's
 * `jest.setup.ts` stubs `hasPointerCapture`/`setPointerCapture`/
 * `releasePointerCapture` (return `false`/no-op, matching jsdom's real "never
 * actually captures a pointer" behavior). Real browsers implement the full
 * Pointer Events capture API natively — this gap and its fix are jsdom-only,
 * verified against the chromium E2E run.
 *
 * **Unlike Radix, no accompanying `scrollIntoView`/`ResizeObserver` gap was
 * found for Reka's `Select`** — this is a genuine, confirmed DOM/behavior
 * delta from `component-driver-radix-v1`'s counterpart, not an oversight:
 * Reka's default (`item-aligned`) open flow only calls `HTMLElement.focus()`
 * to move focus to the highlighted item (`focusFirst` in `reka-ui`'s
 * `Menu/utils.ts`); the one `scrollIntoView` call in Reka's `Select` tree
 * (`SelectScrollButtonImpl.vue`) is unreached unless the viewport actually
 * overflows and mounts a scroll button, which this package's scenes never
 * trigger. The `useResizeObserver` call in `SelectItemAlignedPosition.vue`
 * (Reka's item-aligned positioning) also needs no stub: `@vueuse/core`'s
 * `useResizeObserver` feature-detects `'ResizeObserver' in window` and simply
 * skips constructing one when it's absent, so it never throws under jsdom to
 * begin with. See `jest.setup.ts` for the full reasoning.
 *
 * **No `data-value` on `SelectItem`** (the #923-equivalent decision already
 * applied throughout this package): like Radix, Reka does not render the
 * consumer's `value` prop as a DOM attribute anywhere on `SelectItem` — the
 * only portably readable identity for an item is its VISIBLE LABEL, confirmed
 * against rendered `reka-ui@2.10.1` `SelectItem` DOM (no `value`/`data-value`
 * attribute in the emitted markup). `getValue`/`setValue` therefore operate on
 * that label (not an underlying `value`); `getSelectedLabel`/`selectByLabel`
 * are the primary, unambiguously-named surface, mirroring how this package's
 * `ToggleGroupDriver.getItemByLabel` and `component-driver-radix-v1`'s own
 * `SelectDriver` already commit to label-based item matching.
 *
 * **Reading the selected label excludes the icon**: `SelectIcon` with no
 * children (this driver's test scene, and Reka's own docs example) renders a
 * default "▼" glyph as a `<span aria-hidden="true">`, a sibling of
 * `SelectValue`'s span inside the trigger — the value span carries
 * `style="pointer-events: none"` but, unlike the icon span, no
 * `aria-hidden`. A whole-trigger `getText()` would therefore read
 * `"Apple▼"`. `getSelectedLabel` instead reads only the trigger's direct
 * child `span` that is NOT `aria-hidden`, mirroring what real accessible-name
 * computation does (skip `aria-hidden` branches).
 *
 * **`isDisabled` reads the native `disabled` property, not `aria-disabled`
 * (a confirmed DOM delta from Radix)**: Radix's `Select.Trigger` mirrors its
 * disabled state as `aria-disabled`, so `component-driver-radix-v1`'s driver
 * reads that attribute. Reka's `SelectTrigger` (`reka-ui`'s
 * `Select/SelectTrigger.vue`) never sets `aria-disabled` at all — it only
 * binds the native `disabled` attribute (the trigger renders as a real
 * `<button>`) and a presence-only `data-disabled` — confirmed by rendering
 * both enabled and disabled scenes under jsdom before writing this method.
 * `isDisabled` therefore delegates to `interactor.isDisabled`, which reads the
 * element's native `disabled` property, the same idiom this package's
 * `CheckboxDriver`/`SwitchDriver` already use for their own native-`<button>`
 * roots.
 */
export class SelectDriver extends ComponentDriver<typeof selectParts> implements IInputDriver<string | null> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: selectParts,
    });
  }

  /** Whether the dropdown is open — read from the trigger's Reka `data-state`. */
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

  /**
   * Close the dropdown by clicking the trigger, if open.
   *
   * **Real-browser caveat, confirmed empirically**: while open, Reka's
   * `DismissableLayer` sets `pointer-events: none` on `document.body` (the
   * trigger inherits it, since only the popper content itself opts back in
   * with its own `pointer-events: auto`). Under jsdom this is a no-op (the
   * no-op path here — dropdown already closed — is the only path this
   * package's own tests exercise), but in a real browser a click AT THE
   * TRIGGER'S OWN ELEMENT never becomes actionable while it's covered by
   * that inert region, so `closeDropdown()` called while open will hang
   * until the click's actionability timeout rather than closing the
   * dropdown. `component-driver-radix-v1`'s own suite never exercises this
   * path either (`openDropdown()`-only), so this isn't a Reka-specific
   * regression — it's an inherited, previously-undocumented gap in the
   * ported contract. Prefer `selectByLabel`/`setValue` (which close via
   * clicking an ITEM inside the still-interactive content, not the trigger)
   * to close a dropdown in real-browser tests.
   */
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

  /**
   * Whether the trigger is disabled — reads the native `disabled` property
   * (see class doc for why this differs from Radix's `aria-disabled` check).
   */
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  /** Whether the trigger is marked required (`aria-required`, set when `SelectRoot`'s `required` prop is true). */
  async isRequired(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-required')) === 'true';
  }

  get driverName(): string {
    return 'RekaUiV2SelectDriver';
  }
}
