import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { byLinkedElement, childListHelper, ComponentDriver, PartLocator } from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';
import { ComboboxOptionDriver } from './ComboboxOptionDriver';

const optionSelector = '[role="option"]';
const optionGroupSelector = '[role="group"]';

/**
 * Driver for the Fluent v9 `Combobox` (`@fluentui/react-combobox`, re-exported
 * by `@fluentui/react-components`), composed with `Option`/`OptionGroup`
 * children.
 *
 * DOM audit (@fluentui/react-components@9.74.3): the `data-testid`/locator you
 * put on `<Combobox>` forwards straight to a REAL native `<input
 * role="combobox" type="text">` — the component root IS the input, exactly
 * like `Input`'s own precedent (see the package README) — so this driver
 * extends `HTMLTextInputDriver` wholesale for `getValue`/`setValue`/
 * `isDisabled`/`isReadonly`/`isRequired`/`isError`, all read/written on that
 * same native element. `setValue` drives the FREEFORM typed text; selecting
 * an option below also mirrors that option's text onto the same input value
 * (verified against rendered DOM — Fluent's own `onChange`/`selectOption`
 * both write the identical uncontrolled `value` state), so `getValue()`
 * reflects either path uniformly with no override needed.
 *
 * **Listbox portal — trigger-anchored + `byLinkedElement`**, the same
 * technique `MenuDriver` and `component-driver-radix-v1`'s `PopoverDriver`
 * use (see their class docs): the popup listbox (`role="listbox"`, class
 * `fui-Listbox fui-Combobox__listbox`) mounts into a cloned `FluentProvider`
 * on `document.body` — a sibling of the render root, not a descendant — ONLY
 * while open. Fluent links it back to the trigger input via `aria-controls`
 * pointing at the listbox's `id`, but — UNLIKE `Menu`'s always-present
 * trigger `id` — `aria-controls` here is ABSENT while closed (confirmed by
 * DOM audit: the attribute is omitted entirely, not merely empty), so
 * resolving {@link listboxLocator} throws while closed; {@link isOpen} treats
 * that failure as "not open" instead of letting it throw (the same wall
 * `component-driver-radix-v1`'s `PopoverDriver.exists()` documents for its
 * own `aria-controls` link). `fui-Combobox__listbox` is Combobox-specific
 * (`Dropdown` stamps the distinct `fui-Dropdown__listbox` on the same
 * underlying `Listbox` component — DOM audit), but instance disambiguation
 * here comes from the `id` link itself, not the class, so two simultaneously
 * open `Combobox`es each resolve their own listbox correctly regardless.
 *
 * **Options are enumerated through `OptionGroup` wrappers**: a grouped
 * `Combobox` renders `<div role="listbox"><div role="group">` (the
 * `OptionGroup__label` span, then the `Option` divs, as the group's own
 * children) `</div></div>` — DOM audit. `Option`s are direct children of the
 * GROUP, not of the listbox itself, when grouped. `childListHelper`'s
 * `groupSelector` recursion (`'[role="group"]'`) descends through that
 * wrapper transparently — the label span at the group's first position
 * matches neither the option selector nor the group selector, so the walk
 * simply steps past it — so {@link getOptionCount}/{@link getOptionLabels}/
 * {@link selectByLabel} count and resolve options correctly whether the scene
 * groups them or not.
 *
 * **No portable `selectByValue`**: `Option`'s `value` prop is NEVER reflected
 * to the DOM — confirmed by DOM audit (an `<Option value="x">` renders no
 * attribute carrying `"x"` anywhere; only the visible text ever renders,
 * since Fluent's `useOptionBase_unstable` keeps `value` in React context only
 * and the intrinsic-props filter for a `<div>` strips it before render). The
 * visible label is therefore the ONLY per-option identity a driver can read —
 * the same "label-only identity" limitation `component-driver-radix-v1`
 * documents for Radix `Select.Item` (#923) — so this driver exposes
 * {@link selectByLabel} only.
 *
 * **Scope limit — single-select only**: in `multiselect` mode Fluent changes
 * every `Option`'s role from `"option"`/`aria-selected` to
 * `"menuitemcheckbox"`/`aria-checked` entirely (DOM audit of
 * `useOptionBase_unstable`), which this driver's `[role="option"]` selectors
 * do not match. Driving a `multiselect` `Combobox` is out of scope here — it
 * would need an array-shaped selection API, not this single-value one.
 */
export class ComboboxDriver extends HTMLTextInputDriver {
  /**
   * The portalled listbox, resolved fresh on every call by following this
   * input's `aria-controls` to the listbox's `id` (see class doc). Throws
   * while closed — callers that need a non-throwing check use {@link isOpen}.
   */
  private get listboxLocator(): PartLocator {
    return byLinkedElement('Root')
      .onLinkedElement(this.locator)
      .extractAttribute('aria-controls')
      .toMatchMyAttribute('id');
  }

  /**
   * Whether the popup listbox is mounted. `aria-controls` (the link
   * {@link listboxLocator} resolves through) is absent while closed, so the
   * underlying query cannot even be built — that failure is treated as "not
   * open" rather than left to throw (mirrors `component-driver-radix-v1`'s
   * `PopoverDriver.exists()`).
   */
  async isOpen(): Promise<boolean> {
    try {
      return await this.interactor.exists(this.listboxLocator);
    } catch {
      return false;
    }
  }

  /** Open the listbox by clicking the input, if not already open (Fluent toggles open state on every click of the trigger). */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.interactor.click(this.locator);
    }
  }

  /** Close the listbox by clicking the input, if open. */
  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.interactor.click(this.locator);
    }
  }

  /**
   * The number of options in the listbox (descends through `OptionGroup`
   * wrappers — see class doc). Opens the listbox first: Fluent only mounts
   * it while open.
   */
  async getOptionCount(): Promise<number> {
    await this.open();
    return childListHelper.countMatchingChildren(
      this.interactor,
      this.listboxLocator,
      optionSelector,
      optionGroupSelector
    );
  }

  /**
   * The visible label of every option, in document order (descends through
   * `OptionGroup` wrappers — see class doc). Opens the listbox first.
   */
  async getOptionLabels(): Promise<string[]> {
    await this.open();
    const labels: string[] = [];
    for await (const option of this.iterateOptions()) {
      const label = await option.getLabel();
      if (label != null) {
        labels.push(label);
      }
    }
    return labels;
  }

  /**
   * The option whose visible label matches `label`, or `null` when absent
   * (e.g. no option has that text, or the listbox is empty). Opens the
   * listbox first — Fluent only mounts options while open.
   */
  async getOptionByLabel(label: string): Promise<ComboboxOptionDriver | null> {
    await this.open();
    for await (const option of this.iterateOptions()) {
      if ((await option.getLabel()) === label) {
        return option;
      }
    }
    return null;
  }

  /**
   * Click the option whose visible label matches `label`, opening the
   * listbox first. Fluent closes the listbox and mirrors the option's text
   * onto the input's value once selected (verified against rendered DOM) —
   * no additional `close()` call needed here.
   * @throws {MenuItemNotFoundError} when no such option is mounted.
   */
  async selectByLabel(label: string): Promise<void> {
    const option = await this.getOptionByLabel(label);
    if (!option) {
      throw new MenuItemNotFoundError(label, this);
    }
    await option.click();
  }

  private iterateOptions(): AsyncGenerator<ComboboxOptionDriver> {
    // childListHelper's `host` parameter is a bare `ComponentDriver` (no type
    // param) — the same intentional-variance cast `component-driver-radix-v1`'s
    // `ComboboxDriver` documents.
    return childListHelper.iterateMatchingChildren(
      this as ComponentDriver<any>,
      this.listboxLocator,
      optionSelector,
      ComboboxOptionDriver,
      optionGroupSelector
    );
  }

  override get driverName(): string {
    return 'FluentV9ComboboxDriver';
  }
}
