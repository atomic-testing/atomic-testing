import {
  byAttribute,
  byLinkedElement,
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  IDisableableDriver,
  IInputDriver,
  Interactor,
  IRequirableDriver,
  listHelper,
  locatorUtil,
  PartLocator,
} from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';
import { OptionDriver } from './OptionDriver';
import { OptionGetOption } from './SelectDriver';

/**
 * How long to wait for the option panel's open/close transition. `waitUntil`
 * returns as soon as the state flips, so this is an upper bound, not a delay.
 */
const defaultDropdownTransitionMs = 1000;

/**
 * How long `selectByLabel`/`setValue` keep probing for the requested option to
 * appear — filtering re-renders the option list asynchronously after typing,
 * so a single read would race it. Kept under the test frameworks' default
 * per-test timeout, since an unknown label spends the whole window.
 */
const defaultFilterSettleMs = 2000;

const optionLocator = byRole('option');

/**
 * Driver for the Angular Material autocomplete (`MatAutocomplete`).
 *
 * Locate it by the trigger `<input>` carrying the `[matAutocomplete]`
 * directive (e.g. a `data-testid` placed there) — the input is the
 * `role="combobox"` element and carries the widget's ARIA state
 * (`aria-expanded`, `aria-controls`). The driver *is* the text input, so
 * `getValue` and `enterText` compose the plain input contract with the
 * overlay-panel handling below.
 *
 * The option panel (`role="listbox"` with `role="option"` children) renders
 * outside the input's subtree — a CDK overlay whose exact location drifts by
 * Material major (overlay container on v20, native-popover Top Layer host on
 * v21/v22). Like `SelectDriver`, this driver never assumes a location: it
 * resolves the panel through the ARIA link Material maintains — the trigger's
 * `aria-controls` names the panel's `id` while open, and is removed when
 * closed, so every panel read is guarded by the open state.
 *
 * The panel opens on the trigger's own focus/click/typing handlers (no
 * keyboard workaround needed, unlike `MatSelect`) and only shows while it has
 * content: Material reports `aria-expanded="false"` when filtering has left
 * no options, which this driver surfaces as zero options rather than an
 * error.
 *
 * @see https://material.angular.dev/components/autocomplete
 */
export class AutocompleteDriver
  extends ComponentDriver<{}>
  implements IInputDriver<string | null>, IDisableableDriver, IRequirableDriver
{
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, option);
  }

  /**
   * The open option panel, resolved through the trigger's `aria-controls` →
   * panel `id` link. Only resolvable while the panel is open — Material
   * removes the attribute when closed, so callers must check
   * {@link isDropdownOpen} first.
   */
  private get panelLocator(): PartLocator {
    return byLinkedElement('Root')
      .onLinkedElement(this.locator)
      .extractAttribute('aria-controls')
      .toMatchMyAttribute('id');
  }

  private get optionsLocator(): PartLocator {
    return locatorUtil.append(this.panelLocator, optionLocator);
  }

  /**
   * Whether the option panel is open, per the trigger's `aria-expanded`.
   */
  async isDropdownOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-expanded')) === 'true';
  }

  /**
   * Open the option panel by clicking the trigger input (Material opens on
   * focus/click) and wait for it to be up; a no-op when already open. When
   * the panel has nothing to show — every option filtered out — Material
   * keeps it closed, so this resolves with the panel still reported closed
   * after the transition timeout rather than throwing.
   */
  async openDropdown(): Promise<void> {
    if (await this.isDropdownOpen()) {
      return;
    }
    await this.interactor.click(this.locator);
    await this.interactor.waitUntil({
      probeFn: () => this.isDropdownOpen(),
      terminateCondition: true,
      timeoutMs: defaultDropdownTransitionMs,
    });
  }

  /**
   * Close the option panel with Escape (the documented dismiss key) and wait
   * for it to be gone; a no-op when already closed.
   */
  async closeDropdown(): Promise<void> {
    if (!(await this.isDropdownOpen())) {
      return;
    }
    const panelId = await this.interactor.getAttribute(this.locator, 'aria-controls');
    await this.interactor.pressKey(this.locator, 'Escape');
    await this.waitForDropdownClosed(panelId);
  }

  /**
   * Wait until the panel reports closed AND its element has left the DOM.
   * `aria-expanded` flips immediately, but the panel lingers through its
   * overlay-detach animation; `panelId` must be captured (from
   * `aria-controls`) while the panel was still open, because closing removes
   * the attribute.
   */
  private async waitForDropdownClosed(panelId: string | null | undefined): Promise<void> {
    await this.interactor.waitUntil({
      probeFn: () => this.isDropdownOpen(),
      terminateCondition: false,
      timeoutMs: defaultDropdownTransitionMs,
    });
    if (panelId != null) {
      const detachedPanelLocator = byAttribute('id', panelId, 'Root');
      await this.interactor.waitUntil({
        probeFn: () => this.interactor.exists(detachedPanelLocator),
        terminateCondition: false,
        timeoutMs: defaultDropdownTransitionMs,
      });
    }
  }

  /**
   * Get the driver of the option whose visible label equals `label`, opening
   * the panel first unless `skipDropdownCheck` says the caller already did.
   * Returns `null` when no option matches — including when the panel cannot
   * open because filtering has left nothing to show.
   */
  async getOptionByLabel(label: string, option?: OptionGetOption): Promise<OptionDriver | null> {
    if (!option?.skipDropdownCheck) {
      await this.openDropdown();
    }
    if (!(await this.isDropdownOpen())) {
      return null;
    }
    for await (const item of listHelper.getListItemIterator(this, this.optionsLocator, OptionDriver)) {
      const itemLabel = await item.label();
      if (itemLabel === label) {
        return item;
      }
    }
    return null;
  }

  /**
   * The visible label of every option currently in the panel, in DOM order
   * (opens the panel; `[]` when it cannot open). Reflects the current filter
   * state — type first via {@link enterText} to filter.
   */
  async getOptionLabels(): Promise<string[]> {
    await this.openDropdown();
    if (!(await this.isDropdownOpen())) {
      return [];
    }
    const labels: string[] = [];
    for await (const item of listHelper.getListItemIterator(this, this.optionsLocator, OptionDriver)) {
      labels.push((await item.label()) ?? '');
    }
    return labels;
  }

  /**
   * The number of options currently in the panel (opens the panel; `0` when
   * it cannot open because everything is filtered out).
   */
  async getOptionCount(): Promise<number> {
    await this.openDropdown();
    if (!(await this.isDropdownOpen())) {
      return 0;
    }
    return listHelper.getListItemCount(this, this.optionsLocator);
  }

  /**
   * Select the option with the given visible label, probing until filtering
   * has rendered it (typing re-filters asynchronously). Selecting closes the
   * panel; the wait covers that too.
   * @throws {MenuItemNotFoundError} when no option matches within the probe
   * window
   */
  async selectByLabel(label: string): Promise<void> {
    const item = await this.interactor.waitUntil<OptionDriver | null>({
      probeFn: () => this.getOptionByLabel(label),
      terminateCondition: value => value != null,
      timeoutMs: defaultFilterSettleMs,
    });
    if (item == null) {
      throw new MenuItemNotFoundError(label, this);
    }
    const panelId = await this.interactor.getAttribute(this.locator, 'aria-controls');
    await item.click();
    await this.waitForDropdownClosed(panelId);
  }

  /**
   * The trigger input's current text — after a selection, the label of the
   * selected option.
   */
  async getValue(): Promise<string | null> {
    return (await this.interactor.getInputValue(this.locator)) ?? null;
  }

  /**
   * Type into the trigger input without selecting anything — the raw
   * filter-as-you-type gesture (replaces the current text; Material opens and
   * re-filters the panel from its own input handler). Follow with
   * {@link getOptionCount}/{@link getOptionLabels} to observe the filtered
   * panel, or {@link selectByLabel} to pick from it.
   */
  async enterText(text: string): Promise<void> {
    await this.interactor.enterText(this.locator, text);
  }

  /**
   * The type-then-select flow: types `value` (which filters the panel), then
   * selects the option whose label equals it. `null` clears the input
   * instead.
   * @returns `false` when no option carries that label within the probe
   * window (the typed text stays in the input, the panel is closed again);
   * `true` once the option has been selected — Material then writes the
   * option's value into the input.
   */
  async setValue(value: string | null): Promise<boolean> {
    if (value == null) {
      await this.enterText('');
      // Clearing re-filters to the full option list, and Material reopens the
      // panel asynchronously from its own focus/input handlers — wait for
      // that reopen to land before closing, otherwise the close races it and
      // the panel pops back up after this method resolves.
      await this.interactor.waitUntil({
        probeFn: () => this.isDropdownOpen(),
        terminateCondition: true,
        timeoutMs: defaultDropdownTransitionMs,
      });
      await this.closeDropdown();
      return true;
    }
    await this.enterText(value);
    const item = await this.interactor.waitUntil<OptionDriver | null>({
      probeFn: () => this.getOptionByLabel(value),
      terminateCondition: candidate => candidate != null,
      timeoutMs: defaultFilterSettleMs,
    });
    if (item == null) {
      await this.closeDropdown();
      return false;
    }
    const panelId = await this.interactor.getAttribute(this.locator, 'aria-controls');
    await item.click();
    await this.waitForDropdownClosed(panelId);
    return true;
  }

  /**
   * Whether the trigger input is disabled (the native `disabled` state).
   */
  async isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  /**
   * Whether the trigger input is required (the native `required` state).
   */
  async isRequired(): Promise<boolean> {
    return this.interactor.isRequired(this.locator);
  }

  override get driverName(): string {
    return 'AngularMaterialV20AutocompleteDriver';
  }
}
