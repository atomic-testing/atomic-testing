import {
  byCssClass,
  childListHelper,
  ComponentDriver,
  IComponentDriverOption,
  IDisableableDriver,
  Interactor,
  IReadonlyableDriver,
  IRequirableDriver,
  IValidatableDriver,
  locatorUtil,
  PartLocator,
} from '@atomic-testing/core';

import { TagPickerOptionNotFoundError } from '../errors/TagPickerOptionNotFoundError';
import { tagPickerListLocator } from '../internal/tagPickerLocators';
import { TagPickerOptionDriver } from './TagPickerOptionDriver';

const optionSelector = '[role="option"]';

/**
 * Driver for the Fluent v9 `TagPicker` (`@fluentui/react-tag-picker`, re-exported
 * by `@fluentui/react-components`) — a multiselect, freeform-filterable combobox
 * composed of `TagPickerControl` (wrapping a `TagPickerGroup` of currently
 * selected tags and a freeform `TagPickerInput`) and a portalled `TagPickerList`
 * of `TagPickerOption` children.
 *
 * **Root — put the scene's locator on `TagPickerControl`, not `<TagPicker>`**:
 * DOM audit (@fluentui/react-components@9.74.3): `<TagPicker>` itself renders no
 * DOM at all — it is a pure context-provider wrapper around its `trigger`
 * (`TagPickerControl`) and portalled `popover` (`TagPickerList`) children, the
 * same shape `Popover`/`Dialog` share at their own top level. `TagPickerControl`
 * is the one in-tree, non-portalled element a `data-testid` can land on
 * directly (`getIntrinsicElementProps` spreads it straight onto its root
 * `<div class="fui-TagPickerControl">`), and it contains BOTH the selected-tag
 * group and the freeform input as descendants, so this driver is constructed
 * straight from that locator with no re-root hooks needed.
 *
 * **Selected-tag group and portalled option list share `role="listbox"`**:
 * DOM audit — `TagPickerGroup` explicitly sets `role="listbox"` on itself
 * (`useTagPickerGroup_unstable` hardcodes it), and separately `TagPickerList`
 * (built on `@fluentui/react-combobox`'s `Listbox`) also renders
 * `role="listbox"`. Exactly the collision Wave 2's `PopoverDriver` documents
 * for its own too-generic `role="group"` — this driver anchors on the
 * un-hashed `fui-TagPickerGroup`/`fui-TagPickerList` structural classes
 * instead of role for both, per the package's tier-2 fallback.
 *
 * **Each selected tag ALSO renders `role="option"`**: `TagPickerGroup` forcing
 * `role="listbox"` on itself cascades into `Tag`'s own `useTagBase_unstable`,
 * which renders `role="option"` (not the plain unselectable `role="button"`/no
 * role a bare `Tag` gets elsewhere) for any `Tag` inside a `role="listbox"`
 * group — DOM audit. `TagPickerGroup` also force-sets `dismissible` on every
 * child `Tag` regardless of the consumer's own props, rendering each as a real
 * `<button>` whose default click handler dismisses it (fires the group's
 * `onDismiss`, which the picker wires straight back to deselection) — so
 * {@link removeSelected} is a plain {@link ComponentDriver.click} on the
 * matched tag, no dedicated dismiss-icon target needed.
 *
 * **`TagPickerGroup` renders NOTHING while empty**: DOM audit —
 * `renderTagPickerGroup_unstable` returns `null` outright (not even an empty
 * wrapper `<div>`) when there are zero selected options, unlike a typical
 * "empty container" case. {@link getSelectedLabels} still degrades correctly
 * to `[]` without special-casing: `childListHelper`'s child-count query simply
 * matches nothing when its container locator itself resolves to no element.
 *
 * **Listbox portal — trigger-anchored + `byLinkedElement`, same recipe as
 * `Dropdown`**: DOM audit — the portalled `TagPickerList` mounts into a cloned
 * `FluentProvider` on `document.body` (the same mechanism every Wave 2 overlay
 * and Wave 3's `Combobox`/`Dropdown` use) and is linked back to
 * `TagPickerInput` via `aria-controls` → the list's `id`, present ONLY while
 * open (`TagPickerInput` renders no `id` of its own at all, mirroring
 * `Dropdown`'s trigger — see `../internal/tagPickerLocators.ts`). Because
 * `TagPickerInput` is built on the identical `@fluentui/react-combobox` input
 * trigger primitive `Combobox` uses (`useInputTriggerSlot`, confirmed by DOM
 * audit of the compiled hook), option-reading methods ({@link getOptionCount},
 * {@link getOptionLabels}, {@link getOptionByLabel}, {@link selectByLabel})
 * follow `ComboboxDriver`'s convention of opening the list first rather than
 * `DropdownDriver`'s silent-empty-while-closed one — but still guard the
 * subsequent read in a try/catch (a defensive synthesis of both siblings'
 * conventions), since a disabled or otherwise non-cooperating picker can leave
 * `aria-controls` absent even after a best-effort {@link open}.
 *
 * **`isOpen` reads the input's own `aria-expanded`, not list existence**: DOM
 * audit — like `Dropdown`, Fluent keeps the portalled list mounted after
 * closing (e.g. immediately after {@link selectByLabel} auto-closes the
 * picker) for as long as the input retains focus, only clearing the
 * `aria-controls`/`id` link. A mere existence check would misreport "open"
 * right after a legitimate close, so {@link isOpen} reads `aria-expanded`
 * instead, confirmed to track the open state exactly (including toggling
 * closed on a second click of an already-open input).
 *
 * **Scope limit — no portable per-option `isSelected`**: see
 * {@link TagPickerOptionDriver}'s class doc.
 */
export class TagPickerDriver
  extends ComponentDriver<{}>
  implements IDisableableDriver, IRequirableDriver, IReadonlyableDriver, IValidatableDriver
{
  private readonly groupLocator: PartLocator;
  private readonly inputLocator: PartLocator;
  private readonly listboxLocator: PartLocator;

  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption<{}>>) {
    super(locator, interactor, option);
    this.groupLocator = locatorUtil.append(locator, byCssClass('fui-TagPickerGroup'));
    this.inputLocator = locatorUtil.append(locator, byCssClass('fui-TagPickerInput'));
    this.listboxLocator = tagPickerListLocator(this.inputLocator);
  }

  /** The visible label of every currently selected tag, in DOM order; `[]` when none are selected. */
  async getSelectedLabels(): Promise<string[]> {
    const labels: string[] = [];
    for await (const tag of this.iterateSelectedTags()) {
      const label = await tag.getLabel();
      if (label != null) {
        labels.push(label);
      }
    }
    return labels;
  }

  /**
   * Dismiss the selected tag whose visible label matches `label` (a plain
   * click — see class doc for why the whole tag is the dismiss target).
   * @throws {TagPickerOptionNotFoundError} when no selected tag matches.
   */
  async removeSelected(label: string): Promise<void> {
    for await (const tag of this.iterateSelectedTags()) {
      if ((await tag.getLabel()) === label) {
        await tag.click();
        return;
      }
    }
    throw new TagPickerOptionNotFoundError(label, this);
  }

  /**
   * The freeform input's current filter text (a native `<input>`'s own
   * `.value`, so genuinely empty reads back as `''`, never `null` in
   * practice — `null` is only the theoretical "locator matched nothing" case,
   * mirroring `HTMLTextInputDriver.getValue`'s identical `string | null`
   * contract and `ComboboxDriver.getValue`'s own observed `''` default).
   */
  async getFilterText(): Promise<string | null> {
    const value = await this.interactor.getInputValue(this.inputLocator);
    return value ?? null;
  }

  /** Replace the freeform input's filter text. */
  async setFilter(text: string): Promise<void> {
    await this.interactor.enterText(this.inputLocator, text);
  }

  /** Whether the option list is expanded, via the input's own `aria-expanded` (see class doc). */
  async isOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.inputLocator, 'aria-expanded')) === 'true';
  }

  /** Open the option list by clicking the freeform input, if not already open. */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.interactor.click(this.inputLocator);
    }
  }

  /** Close the option list by clicking the freeform input, if open. */
  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.interactor.click(this.inputLocator);
    }
  }

  /**
   * The number of options in the list — opens it first if not already open
   * (see class doc); `0` only if the listbox still can't be resolved after
   * that best-effort open (e.g. a disabled or otherwise non-cooperating
   * picker), not merely because the picker started closed.
   */
  async getOptionCount(): Promise<number> {
    await this.open();
    try {
      return await childListHelper.countMatchingChildren(this.interactor, this.listboxLocator, optionSelector);
    } catch {
      return 0;
    }
  }

  /**
   * The visible labels of every option in the list, in DOM order — opens it
   * first if not already open (see class doc); `[]` only if the listbox
   * still can't be resolved after that best-effort open, not merely because
   * the picker started closed.
   */
  async getOptionLabels(): Promise<string[]> {
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
   * The option whose visible label matches `label` — opens the list first if
   * not already open (see class doc); `null` when no option matches, or when
   * the listbox still can't be resolved after that best-effort open, not
   * merely because the picker started closed.
   */
  async getOptionByLabel(label: string): Promise<TagPickerOptionDriver | null> {
    for await (const option of this.iterateOptions()) {
      if ((await option.getLabel()) === label) {
        return option;
      }
    }
    return null;
  }

  /**
   * Click the option whose visible label matches `label`, opening the list
   * first. Fluent closes the list and mirrors the option into the selected-tag
   * group once selected (verified against rendered DOM) — no additional
   * {@link close} call needed here.
   * @throws {TagPickerOptionNotFoundError} when no option matches.
   */
  async selectByLabel(label: string): Promise<void> {
    const option = await this.getOptionByLabel(label);
    if (!option) {
      throw new TagPickerOptionNotFoundError(label, this);
    }
    await option.click();
  }

  private iterateSelectedTags(): AsyncGenerator<TagPickerOptionDriver> {
    return childListHelper.iterateMatchingChildren(
      this as ComponentDriver<any>,
      this.groupLocator,
      optionSelector,
      TagPickerOptionDriver
    );
  }

  private async *iterateOptions(): AsyncGenerator<TagPickerOptionDriver> {
    await this.open();
    try {
      yield* childListHelper.iterateMatchingChildren(
        this as ComponentDriver<any>,
        this.listboxLocator,
        optionSelector,
        TagPickerOptionDriver
      );
    } catch {
      // Closed (or otherwise not cooperating) — no options reachable, see class doc.
    }
  }

  /** Whether the freeform input is disabled (native `disabled` attribute). */
  async isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.inputLocator);
  }

  /** Whether the freeform input is marked required (native `required` attribute). */
  async isRequired(): Promise<boolean> {
    return this.interactor.isRequired(this.inputLocator);
  }

  /** Whether the freeform input is read-only (native `readonly` attribute). */
  async isReadonly(): Promise<boolean> {
    return this.interactor.isReadonly(this.inputLocator);
  }

  /** Whether the freeform input is in an invalid/error state (`aria-invalid="true"`). */
  async isError(): Promise<boolean> {
    return this.interactor.isError(this.inputLocator);
  }

  get driverName(): string {
    return 'FluentV9TagPickerDriver';
  }
}
