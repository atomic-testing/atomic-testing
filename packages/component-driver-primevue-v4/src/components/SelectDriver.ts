import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  byRole,
  childListHelper,
  ComponentDriver,
  IComponentDriverOption,
  IDisableableDriver,
  IInputDriver,
  Interactor,
  locatorUtil,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';
import { byAriaIdReference } from '../internal/ariaLinkedLocators';
import { MenuItemDriver } from './MenuItemDriver';

/** CSS for a PrimeVue select option — the ARIA role, never a theme class. */
const optionSelector = '[role="option"]';

export const selectParts = {
  /**
   * The teleported overlay's `role="listbox"` `<ul>` — a `'Root'`-relative
   * per-part re-root (the MUI `SelectDriver` recipe), resolved through THIS
   * select's own combobox `aria-controls` id link (the linked locator's
   * source resolves relative to this part's parent chain, i.e. this driver's
   * root) rather than a bare document-rooted `byRole('listbox')` — so
   * multiple Selects (or an inline PrimeVue Listbox elsewhere on the page)
   * can never collide. No "one open listbox at a time" assumption needed,
   * unlike Radix/MUI whose DOM has no such link.
   */
  dropdown: {
    locator: byAriaIdReference(byRole('combobox'), 'aria-controls'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export type SelectScenePart = typeof selectParts;

export interface SelectItemGetOption {
  /** When true, skip the open-dropdown check to save a round trip. */
  skipDropdownCheck?: boolean;
}

/**
 * Driver for the PrimeVue `Select` component (the v4 rename of `Dropdown`).
 *
 * DOM audit (primevue@4.5.5): the in-tree root is a styled
 * `<div data-pc-name="select">`; the ARIA surface lives on an inner
 * `<span role="combobox">` carrying `aria-expanded`, `aria-disabled` and
 * `aria-controls` → the id of the teleported overlay's `role="listbox"`
 * `<ul>` (a `document.body` child by default via `appendTo`). Options are
 * `<li role="option">` children of that list with `aria-label`/
 * `aria-selected` — and, like Radix (and unlike MUI's `data-value`), **no
 * value-ish attribute anywhere**: the `optionValue` a consumer binds never
 * reaches the DOM. The only portably readable item identity is therefore the
 * VISIBLE LABEL — `getValue`/`setValue` operate on that label, and
 * `getSelectedLabel`/`selectByLabel` are the primary, unambiguously named
 * surface (the same decision the Radix `SelectDriver` records).
 *
 * The trigger's visible text is the `data-pc-section="label"` span, which
 * shows the placeholder when nothing is selected; PrimeVue marks that state
 * with a `placeholder`/`empty` token in the span's `data-p` attribute, which
 * is how {@link getSelectedLabel} distinguishes "no selection" from a real
 * selection whose label happens to equal the placeholder.
 *
 * **Anchoring (`appendTo`, #1033): no option needed, unlike {@link DialogDriver}
 * /{@link MenuDriver}.** The `dropdown` part above resolves via a `'Root'`-relative
 * `byLinkedElement` id match (see `byAriaIdReference`), which is a
 * `document.querySelector`-style global id lookup — it finds the listbox
 * wherever it physically sits in the DOM, so it resolves identically whether
 * PrimeVue's `Portal` teleports the listbox to `document.body` (the default)
 * or renders it in-tree (`appendTo="self"`, where `Portal` skips `<Teleport>`
 * entirely — see `primevue/portal/Portal.vue`'s `inline` computed). Verified
 * directly rather than assumed: see the `appendTo="self"` suite coverage.
 */
export class SelectDriver
  extends ComponentDriver<SelectScenePart>
  implements IInputDriver<string | null>, IDisableableDriver
{
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: selectParts,
    });
  }

  private get comboboxLocator(): PartLocator {
    return locatorUtil.append(this.locator, byRole('combobox'));
  }

  /** Whether the dropdown is open — `aria-expanded` on the combobox, per PrimeVue's a11y contract. */
  async isDropdownOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.comboboxLocator, 'aria-expanded')) === 'true';
  }

  /** Open the dropdown by clicking the trigger, if not already open. */
  async openDropdown(): Promise<void> {
    if (await this.isDropdownOpen()) {
      return;
    }
    await this.click();
    await this.waitUntil({ probeFn: () => this.isDropdownOpen(), terminateCondition: true, timeoutMs: 5000 });
  }

  /** Close the dropdown by clicking the trigger, if open. */
  async closeDropdown(): Promise<void> {
    if (!(await this.isDropdownOpen())) {
      return;
    }
    await this.click();
    await this.waitUntil({ probeFn: () => this.isDropdownOpen(), terminateCondition: false, timeoutMs: 5000 });
  }

  /**
   * The trigger's visible selected-value text, or `null` when the label span
   * is showing the placeholder / empty state (see class doc).
   */
  async getSelectedLabel(): Promise<string | null> {
    const labelLocator = locatorUtil.append(this.locator, byCssSelector('[data-pc-section="label"]'));
    const stateTokens = ((await this.interactor.getAttribute(labelLocator, 'data-p')) ?? '').split(/\s+/);
    if (stateTokens.includes('placeholder') || stateTokens.includes('empty')) {
      return null;
    }
    const label = await this.interactor.getText(labelLocator);
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
    // childListHelper's `host` parameter is a bare `ComponentDriver` (no type
    // param), so a driver like this one with its own non-empty `parts` (the
    // `dropdown` part) fails structural assignability on `getMissingPartNames`'s
    // return type — the same "intentional variance" gap CLAUDE.md documents for
    // `ComponentDriverClass<T extends ComponentDriver<any>>`. `interactor` and
    // `commutableOption`, the only members `iterateMatchingChildren` actually
    // reads, are unaffected by the cast.
    for await (const item of childListHelper.iterateMatchingChildren(
      this as ComponentDriver<any>,
      this.parts.dropdown.locator,
      optionSelector,
      MenuItemDriver
    )) {
      if ((await item.getLabel()) === label) {
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
    return childListHelper.countMatchingChildren(this.interactor, this.parts.dropdown.locator, optionSelector);
  }

  /** The option at the given zero-based index, or `null` if out of range. */
  async getMenuItemByIndex(index: number): Promise<MenuItemDriver | null> {
    let position = 0;
    // See the variance-cast note in getMenuItemByLabel.
    for await (const item of childListHelper.iterateMatchingChildren(
      this as ComponentDriver<any>,
      this.parts.dropdown.locator,
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

  /** Whether the select is disabled — `aria-disabled` on the combobox, per PrimeVue's a11y contract. */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.comboboxLocator, 'aria-disabled')) === 'true';
  }

  get driverName(): string {
    return 'PrimeVueV4SelectDriver';
  }
}
