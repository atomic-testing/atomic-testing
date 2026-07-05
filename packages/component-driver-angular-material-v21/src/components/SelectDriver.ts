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

export interface OptionGetOption {
  /**
   * When true, the driver will not ensure the option panel is open first,
   * which speeds things up when the caller has already opened it.
   */
  skipDropdownCheck?: boolean;
}

/**
 * How long to wait for the option panel's open/close transition. `waitUntil`
 * returns as soon as the state flips, so this is an upper bound, not a delay.
 */
const defaultDropdownTransitionMs = 1000;

const optionLocator = byRole('option');

/**
 * Driver for the Angular Material select (`MatSelect`).
 *
 * Locate it by the `<mat-select>` host element (e.g. a `data-testid` placed
 * there) — the host is the `role="combobox"` trigger and carries the widget's
 * ARIA state (`aria-expanded`, `aria-disabled`, `aria-required`).
 *
 * The option panel (`role="listbox"` with `role="option"` children) renders
 * outside the host's subtree, and *where* differs by Material major: on v20
 * it is portaled into the CDK overlay container on `document.body`, while on
 * v21/v22 the CDK inserts it as a native-popover sibling of the trigger's
 * form field (promoted to the browser Top Layer). The driver is insulated
 * from that drift by never assuming a location: it resolves the panel through
 * the ARIA link Material maintains — the host's `aria-controls` names the
 * panel's `id` while open.
 *
 * Interactions are keyboard-driven (`Enter` opens, `Escape` closes — the
 * documented MatSelect keyboard contract) because Material's only click
 * handler sits on an inner trigger div, which a synthetic click on the host
 * never reaches.
 *
 * Note on values: MatSelect option values are JavaScript objects with no DOM
 * serialization (there is no hidden native input, unlike MUI), so the
 * accessible value — what {@link getValue} returns and {@link setValue}
 * accepts — is the option's visible **label**. When nothing is selected the
 * trigger shows the placeholder (or nothing); an empty trigger reads as
 * `null`.
 *
 * @see https://material.angular.dev/components/select
 */
export class SelectDriver
  extends ComponentDriver<{}>
  implements IInputDriver<string | null>, IDisableableDriver, IRequirableDriver
{
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, option);
  }

  /**
   * The open option panel, resolved through the host's `aria-controls` →
   * panel `id` link. Only resolvable while the panel is open — Material
   * removes the attribute (and the panel) when closed.
   */
  private get panelLocator(): PartLocator {
    return byLinkedElement('Root').onLinkedElement(this.locator).extractAttribute('aria-controls').toMatchMyAttribute('id');
  }

  private get optionsLocator(): PartLocator {
    return locatorUtil.append(this.panelLocator, optionLocator);
  }

  /**
   * Whether the option panel is open, per the host's `aria-expanded`.
   */
  async isDropdownOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-expanded')) === 'true';
  }

  /**
   * Open the option panel (no-op when already open) and wait for it to be up.
   */
  async openDropdown(): Promise<void> {
    if (await this.isDropdownOpen()) {
      return;
    }
    await this.interactor.pressKey(this.locator, 'Enter');
    await this.interactor.waitUntil({
      probeFn: () => this.isDropdownOpen(),
      terminateCondition: true,
      timeoutMs: defaultDropdownTransitionMs,
    });
  }

  /**
   * Close the option panel (no-op when already closed) and wait for it to be
   * gone.
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
   * `aria-expanded` flips immediately, but the panel lingers through its exit
   * animation — and on v21/v22 it lingers *inside the host*, so a host-text
   * read taken then would still see the option list. `panelId` must be
   * captured (from `aria-controls`) while the panel was still open, because
   * closing removes the attribute.
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
   * Returns `null` when no option matches.
   */
  async getOptionByLabel(label: string, option?: OptionGetOption): Promise<OptionDriver | null> {
    if (!option?.skipDropdownCheck) {
      await this.openDropdown();
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
   * The visible label of every option, in DOM order (opens the panel).
   */
  async getOptionLabels(): Promise<string[]> {
    await this.openDropdown();
    const labels: string[] = [];
    for await (const item of listHelper.getListItemIterator(this, this.optionsLocator, OptionDriver)) {
      labels.push((await item.label()) ?? '');
    }
    return labels;
  }

  /**
   * The number of options in the panel (opens the panel).
   */
  async getOptionCount(): Promise<number> {
    await this.openDropdown();
    return listHelper.getListItemCount(this, this.optionsLocator);
  }

  /**
   * Select the option with the given visible label.
   * @throws {MenuItemNotFoundError} when no option matches
   */
  async selectByLabel(label: string): Promise<void> {
    await this.openDropdown();
    const item = await this.getOptionByLabel(label, { skipDropdownCheck: true });
    if (item == null) {
      throw new MenuItemNotFoundError(label, this);
    }
    const isMultiple = (await this.interactor.getAttribute(this.panelLocator, 'aria-multiselectable')) === 'true';
    const panelId = await this.interactor.getAttribute(this.locator, 'aria-controls');
    await item.click();
    // A single select closes itself upon selection; a multiple select stays
    // open for further picks.
    if (!isMultiple) {
      await this.waitForDropdownClosed(panelId);
    }
  }

  /**
   * The selected option's visible label, or `null` when nothing is selected.
   *
   * Closed, the trigger's text is the value — with the caveat that a
   * configured `placeholder` is what an empty select shows (it is the
   * accessible value screen readers announce; Material exposes no ARIA-level
   * distinction). Open, the trigger's text cannot be used: on v21/v22 the
   * panel renders inline inside the host, so the host text would be the
   * whole option list — instead the `aria-selected="true"` option is read
   * (the first one, for a `multiple` select).
   */
  async getSelectedLabel(): Promise<string | null> {
    if (await this.isDropdownOpen()) {
      const selectedOptionLocator = locatorUtil.append(
        this.panelLocator,
        optionLocator,
        byAttribute('aria-selected', 'true', 'Same')
      );
      if (!(await this.interactor.exists(selectedOptionLocator))) {
        return null;
      }
      const label = (await this.interactor.getText(selectedOptionLocator))?.trim();
      return label ? label : null;
    }
    const label = (await this.getText())?.trim();
    return label ? label : null;
  }

  /**
   * The select's value in its only DOM-observable form — the selected
   * option's visible label (see the class doc). `null` when empty.
   */
  getValue(): Promise<string | null> {
    return this.getSelectedLabel();
  }

  /**
   * Select the option labelled `value`.
   * @returns `false` when no option carries that label (the panel is closed
   * again in that case), `true` once the option has been clicked.
   */
  async setValue(value: string | null): Promise<boolean> {
    if (value == null) {
      return false;
    }
    await this.openDropdown();
    const item = await this.getOptionByLabel(value, { skipDropdownCheck: true });
    if (item == null) {
      await this.closeDropdown();
      return false;
    }
    const isMultiple = (await this.interactor.getAttribute(this.panelLocator, 'aria-multiselectable')) === 'true';
    const panelId = await this.interactor.getAttribute(this.locator, 'aria-controls');
    await item.click();
    if (!isMultiple) {
      await this.waitForDropdownClosed(panelId);
    }
    return true;
  }

  /**
   * Whether the select is disabled, per the host's `aria-disabled`.
   */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  /**
   * Whether the select is required, per the host's `aria-required`.
   */
  async isRequired(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-required')) === 'true';
  }

  override get driverName(): string {
    return 'AngularMaterialV21SelectDriver';
  }
}
