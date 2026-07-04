import {
  byCssSelector,
  childListHelper,
  ComponentDriver,
  locatorUtil,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';
import { MenuItemDriver } from './MenuItemDriver';
import { PopoverDriver } from './PopoverDriver';

/**
 * CSS for cmdk's parts. These are cmdk's PUBLIC attribute API — its docs
 * instruct consumers to style via `[cmdk-input]`/`[cmdk-item]`/etc., so they
 * are stable anchors on the same tier as Radix's `data-state` attributes
 * (never a Tailwind/shadcn class). `role="option"` is doubled onto the item
 * selector so a consumer forwarding a stray `cmdk-item`-like attribute can
 * never be confused with a real option.
 */
const inputSelector = '[cmdk-input]';
const listSelector = '[cmdk-list]';
const emptySelector = '[cmdk-empty]';
const itemSelector = '[cmdk-item][role="option"]';

/** Escape a value for embedding inside a double-quoted CSS attribute selector. */
function escapeAttributeValue(value: string): string {
  return value.replace(/(["\\])/g, '\\$1');
}

/**
 * Driver for the shadcn/ui "Combobox" COMPOSITION: a Radix `Popover` whose
 * content hosts a cmdk (https://cmdk.paco.me) `Command` palette. This is not a
 * Radix primitive — Radix ships no Combobox — so this driver deliberately
 * straddles two libraries (#1007):
 *
 * - The trigger + portalled-panel lifecycle is Radix Popover's, inherited from
 *   {@link PopoverDriver} unchanged (trigger-anchored `aria-controls` →
 *   `byLinkedElement` content resolution; see that class's doc for why the
 *   static portal-hook recipe does not work for popovers).
 * - Everything inside the panel is cmdk's: the filter input, the filtered
 *   `role="listbox"` of `role="option"` items, the keyboard-highlight state.
 *   The anchors are cmdk's public styling attributes (`[cmdk-input]`,
 *   `[cmdk-item]`, ...) plus the ARIA it renders — never utility classes.
 *
 * **Value semantics — cmdk DOES render `data-value`** (unlike Radix
 * `Select.Item`, whose label-only identity the #923 decision documents):
 * every `Command.Item` carries its `value` prop (or, when omitted, its text
 * content) as a `data-value` attribute, and the keyboard-highlighted item is
 * marked `data-selected="true"`. Item identity in this driver is therefore
 * VALUE-based (`selectByValue`, `getHighlightedValue`) — the opposite of
 * `SelectDriver`'s label-based surface — with `selectByLabel` also provided
 * for text-first scenes.
 *
 * **Filtering is cmdk-internal**: typing into the input UNMOUNTS non-matching
 * items (they are removed from the DOM, not hidden), and when nothing matches
 * cmdk mounts `Command.Empty` (`[cmdk-empty]`). `getOptionCount`/
 * `getOptionValues` therefore reflect the CURRENT filter state by
 * construction, and `isEmpty()` reads the empty element's presence.
 *
 * **v1 scope limits** (documented per #1007's best-effort framing):
 * - The selected value is read from the trigger's visible text
 *   (`getSelectedLabel`) — the composition keeps selection state in consumer
 *   React state rendered into the trigger (as shadcn's recipe does); there is
 *   no DOM attribute carrying it.
 * - `Command.Group` headings are not modeled; item enumeration recurses
 *   through wrapper elements (`childListHelper`'s `'*'` group descent), so
 *   grouped items are still found, in document order.
 * - cmdk inside Radix `Dialog` (the "command palette" usage) is out of scope —
 *   that pairing is `DialogDriver` territory and would motivate the standalone
 *   `component-driver-cmdk` package #1007 names if demand appears.
 */
export class ComboboxDriver<ContentT extends ScenePart = {}> extends PopoverDriver<ContentT> {
  /** The cmdk filter input inside the open panel. */
  protected get inputLocator(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(inputSelector));
  }

  /**
   * The DIRECT parent of the option items. cmdk renders items under
   * `[cmdk-list] > [cmdk-list-sizer]` (an internal measuring wrapper), but the
   * sizer is undocumented; anchoring iteration at the documented `[cmdk-list]`
   * and letting `childListHelper` descend through wrappers keeps the driver on
   * cmdk's public surface only.
   */
  protected get listLocator(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(listSelector));
  }

  /** The trigger's visible text — the selected label in the shadcn composition (see class doc). */
  async getSelectedLabel(): Promise<string | null> {
    const label = await this.interactor.getText(this.triggerLocator);
    return label?.trim() || null;
  }

  /**
   * Replace the cmdk filter input's text (empty string clears the filter).
   * Opens the panel first — the input only mounts while open.
   */
  async setFilter(text: string): Promise<void> {
    await this.openAndWait();
    await this.interactor.enterText(this.inputLocator, text);
  }

  /** The cmdk filter input's current text. Opens the panel first. */
  async getFilterText(): Promise<string | null> {
    await this.openAndWait();
    return (await this.interactor.getInputValue(this.inputLocator)) ?? null;
  }

  /** Whether cmdk's `Command.Empty` is mounted — i.e. the current filter matches nothing. */
  async isEmpty(): Promise<boolean> {
    return this.interactor.exists(locatorUtil.append(this.locator, byCssSelector(emptySelector)));
  }

  /** The number of options matching the CURRENT filter (cmdk unmounts filtered-out items). */
  async getOptionCount(): Promise<number> {
    await this.openAndWait();
    return childListHelper.countMatchingChildren(this.interactor, this.listLocator, itemSelector, '*');
  }

  /** The `data-value` of every option matching the current filter, in document order. */
  async getOptionValues(): Promise<string[]> {
    await this.openAndWait();
    const values: string[] = [];
    for await (const item of this.iterateOptions()) {
      const value = await item.getValue();
      if (value != null) {
        values.push(value);
      }
    }
    return values;
  }

  /** The `data-value` of the keyboard-highlighted option (`data-selected="true"`), or `undefined` when none. */
  async getHighlightedValue(): Promise<Optional<string>> {
    const highlighted = locatorUtil.append(this.locator, byCssSelector(`${itemSelector}[data-selected="true"]`));
    if (!(await this.interactor.exists(highlighted))) {
      return undefined;
    }
    return (await this.interactor.getAttribute(highlighted, 'data-value')) ?? undefined;
  }

  /**
   * Click the option whose `data-value` equals `value` (must match the current
   * filter — cmdk unmounts filtered-out items). Opens the panel first; the
   * composition's `onSelect` conventionally closes it.
   * @throws {MenuItemNotFoundError} when no such option is mounted.
   */
  async selectByValue(value: string): Promise<void> {
    await this.openAndWait();
    const itemLocator = locatorUtil.append(
      this.locator,
      byCssSelector(`${itemSelector}[data-value="${escapeAttributeValue(value)}"]`)
    );
    if (!(await this.interactor.exists(itemLocator))) {
      throw new MenuItemNotFoundError(value, this);
    }
    await this.interactor.click(itemLocator);
  }

  /**
   * Click the option whose visible label equals `label`, iterating the mounted
   * (filter-matching) options.
   * @throws {MenuItemNotFoundError} when no such option is mounted.
   */
  async selectByLabel(label: string): Promise<void> {
    await this.openAndWait();
    for await (const item of this.iterateOptions()) {
      if ((await item.getLabel()) === label) {
        await item.click();
        return;
      }
    }
    throw new MenuItemNotFoundError(label, this);
  }

  /** Move cmdk's keyboard highlight down one option (ArrowDown on the filter input). */
  async highlightNext(): Promise<void> {
    await this.openAndWait();
    await this.interactor.pressKey(this.inputLocator, 'ArrowDown');
  }

  /** Move cmdk's keyboard highlight up one option (ArrowUp on the filter input). */
  async highlightPrevious(): Promise<void> {
    await this.openAndWait();
    await this.interactor.pressKey(this.inputLocator, 'ArrowUp');
  }

  /** Select the keyboard-highlighted option (Enter on the filter input). */
  async selectHighlighted(): Promise<void> {
    await this.openAndWait();
    await this.interactor.pressKey(this.inputLocator, 'Enter');
  }

  private async openAndWait(): Promise<void> {
    await this.open();
    await this.waitForOpen();
  }

  private iterateOptions(): AsyncGenerator<ComboboxOptionDriver> {
    // childListHelper's `host` parameter is a bare `ComponentDriver` (no type
    // param) — the same intentional-variance cast SelectDriver documents.
    return childListHelper.iterateMatchingChildren(
      this as ComponentDriver<any>,
      this.listLocator,
      itemSelector,
      ComboboxOptionDriver,
      '*'
    );
  }

  override get driverName(): string {
    return 'RadixV1ComboboxDriver';
  }
}

/**
 * A single cmdk `Command.Item` (`[cmdk-item]`, `role="option"`). Extends the
 * shared {@link MenuItemDriver} (label + `aria-disabled` reads) with the
 * cmdk-specific `data-value`/`data-selected` attributes cmdk renders and Radix
 * `Select.Item` does not.
 */
export class ComboboxOptionDriver extends MenuItemDriver {
  /** The option's `data-value` — its `Command.Item` `value` prop (or text content when omitted). */
  async getValue(): Promise<string | null> {
    return (await this.interactor.getAttribute(this.locator, 'data-value')) ?? null;
  }

  /** Whether this option holds cmdk's keyboard highlight (`data-selected="true"`). */
  async isHighlighted(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-selected')) === 'true';
  }

  override get driverName(): string {
    return 'RadixV1ComboboxOptionDriver';
  }
}
