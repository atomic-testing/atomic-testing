import {
  childListHelper,
  ComponentDriver,
  IComponentDriverOption,
  IDisableableDriver,
  Interactor,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { DropdownOptionNotFoundError } from '../errors/DropdownOptionNotFoundError';
import { dropdownListboxLocator } from '../internal/dropdownLocators';
import { DropdownOptionDriver } from './DropdownOptionDriver';

const optionSelector = '[role="option"]';

/**
 * Driver for the Fluent v9 `Dropdown` (`@fluentui/react-select`) — NOT the
 * native-`<select>`-backed `Select` component Wave 1 already covers (see the
 * package README's Wave 1 table): despite the shared "Select" family naming
 * in Fluent's own package layout, `Dropdown` is a completely custom-rendered
 * combobox-style widget, hence this driver's distinct name.
 *
 * DOM audit (@fluentui/react-components@9.74.3): the scene's own locator
 * (`data-testid`/etc.) forwarded onto `<Dropdown>` lands on a REAL
 * `<button role="combobox">` — the trigger IS the component root, so this
 * driver is constructed straight from the scene locator with no re-root, the
 * same shape as `MenuButtonDriver`. The `Option` children only exist in the
 * DOM once the dropdown has actually been opened: they portal into a cloned
 * `FluentProvider` on `document.body` (the same recipe every Wave 2 overlay
 * uses), so every method that reads the option list — {@link getOptionCount},
 * {@link getOptionLabels}, {@link getOptionByLabel}, {@link selectByLabel} —
 * requires the dropdown to already be {@link open} (mirrors `MenuDriver`'s
 * item-reading methods, which make the same assumption about `MenuList`).
 *
 * **`isOpen` reads `aria-expanded`, not listbox existence**: verified against
 * rendered DOM — Fluent keeps the portalled listbox MOUNTED after closing
 * (e.g. immediately after {@link selectByLabel} auto-closes the dropdown) for
 * as long as the trigger retains focus, only removing the `aria-controls`/
 * `aria-owns` links that tie the listbox back to this instance. A mere
 * "does the listbox exist" check would therefore misreport "open" right after
 * a legitimate close, so {@link isOpen} instead reads the trigger's own
 * `aria-expanded`, which tracks the `open` state exactly.
 *
 * **Listbox resolution is trigger-anchored, following `aria-controls`**:
 * unlike `MenuTrigger` (clones a stable `id` onto its child regardless of
 * open state — see `../internal/menuLocators.ts`), `Dropdown`'s trigger button
 * carries no `id` of its own at all; the only DOM link to the portalled
 * listbox is `aria-controls`, set ONLY while `open` is `true` (see
 * `../internal/dropdownLocators.ts`). Every method that touches the listbox
 * therefore guards the resulting `byLinkedElement` resolution in a try/catch —
 * the same idiom `TooltipDriver` uses for its own open-state-only
 * `aria-describedby` link — collapsing "closed, so nothing to read" into an
 * empty/absent result rather than a thrown `LocatorResolutionError`.
 *
 * **`getSelectedLabel` reads the trigger's own displayed text**: Fluent does
 * NOT auto-synchronize the trigger's display from `selectedOptions` — its own
 * types document that a caller supplying `defaultSelectedOptions` MUST also
 * supply `defaultValue` for the initial render — so the trigger's visible
 * text (driven by the consumer's `value`/`defaultValue`, or by Fluent's own
 * uncontrolled state after a real user selection) IS the authoritative
 * "currently selected label" a real user sees. One consequence, noted in the
 * package's Known gaps: a `placeholder` renders through that SAME text node
 * when nothing is selected, so this driver cannot distinguish "placeholder
 * shown" from "a genuinely selected option whose label equals the placeholder"
 * by DOM alone.
 *
 * **Single-select only — `multiselect` changes the DOM contract materially**:
 * verified against rendered DOM — a `multiselect` Dropdown's listbox renders
 * `role="menu"` (not `role="listbox"`) and each option renders
 * `role="menuitemcheckbox"` with `aria-checked` (not `role="option"` with
 * `aria-selected`). This driver targets the single-select contract only;
 * multiselect is out of scope for v1 (see the package's Known gaps).
 */
export class DropdownDriver extends ComponentDriver<{}> implements IDisableableDriver {
  private readonly listboxLocator: PartLocator;

  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption<{}>>) {
    super(locator, interactor, option);
    this.listboxLocator = dropdownListboxLocator(locator);
  }

  /**
   * Whether the dropdown's listbox is expanded, via the trigger's own
   * `aria-expanded` (see class doc for why this is not a listbox-existence
   * check).
   */
  async isOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-expanded')) === 'true';
  }

  /** Open the dropdown by clicking its trigger, if not already open. */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.interactor.click(this.locator);
    }
  }

  /** Close the dropdown by clicking its trigger, if open. */
  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.interactor.click(this.locator);
    }
  }

  /** Whether the dropdown is disabled (native `disabled` attribute on the trigger button). */
  async isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  /**
   * The trigger's own displayed text (see class doc), or `undefined` when it
   * renders no text at all — the common "nothing selected, no `placeholder`"
   * case.
   */
  async getSelectedLabel(): Promise<Optional<string>> {
    return (await this.getText())?.trim() || undefined;
  }

  /** The number of options in the open listbox; `0` while closed (see class doc). */
  async getOptionCount(): Promise<number> {
    try {
      return await childListHelper.countMatchingChildren(this.interactor, this.listboxLocator, optionSelector);
    } catch {
      return 0;
    }
  }

  /** The visible labels of every option in the open listbox, in DOM order; `[]` while closed. */
  async getOptionLabels(): Promise<string[]> {
    const labels = await Promise.all((await this.getOptions()).map(option => option.getLabel()));
    return labels.filter((label): label is string => label != null);
  }

  /** The option whose visible label matches `label`, or `null` when absent (or while closed). */
  async getOptionByLabel(label: string): Promise<DropdownOptionDriver | null> {
    for (const option of await this.getOptions()) {
      if ((await option.getLabel()) === label) {
        return option;
      }
    }
    return null;
  }

  /**
   * Click the option whose visible label matches `label` (closes the dropdown,
   * per Fluent's default single-select behavior).
   * @throws {DropdownOptionNotFoundError} when no option matches — including
   * when the dropdown is closed, since no options are reachable then.
   */
  async selectByLabel(label: string): Promise<void> {
    const option = await this.getOptionByLabel(label);
    if (!option) {
      throw new DropdownOptionNotFoundError(label, this);
    }
    await option.click();
  }

  private async getOptions(): Promise<DropdownOptionDriver[]> {
    try {
      const items: DropdownOptionDriver[] = [];
      for await (const item of childListHelper.iterateMatchingChildren(
        this,
        this.listboxLocator,
        optionSelector,
        DropdownOptionDriver
      )) {
        items.push(item);
      }
      return items;
    } catch {
      return [];
    }
  }

  get driverName(): string {
    return 'FluentV9DropdownDriver';
  }
}
