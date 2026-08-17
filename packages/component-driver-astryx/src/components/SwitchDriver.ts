import { HTMLCheckboxDriver } from '@atomic-testing/component-driver-html';
import { byCssSelector, Optional } from '@atomic-testing/core';

import { resolveDescribedByRoleText, resolveLinkedLabelText } from '../internal/linkedLocators';

/**
 * Driver for the Astryx Switch (`@astryxdesign/core/Switch`).
 *
 * Astryx puts `role="switch"` on the inner `<input type="checkbox">` (the root
 * `<div>` has no role) and does NOT forward `data-testid`, so the scene anchors
 * the input by `byRole('switch')`. On/off + disabled come from
 * {@link HTMLCheckboxDriver}; the label is resolved via the `<label for>`↔`id`
 * link.
 */
export class SwitchDriver extends HTMLCheckboxDriver {
  /** Whether the switch is on (checked). Alias of {@link isSelected}. */
  async isOn(): Promise<boolean> {
    return this.isSelected();
  }

  /** Turn the switch on if it is off. */
  async turnOn(): Promise<void> {
    await this.setSelected(true);
  }

  /** Turn the switch off if it is on. */
  async turnOff(): Promise<void> {
    await this.setSelected(false);
  }

  /** Flip the switch. */
  async toggle(): Promise<void> {
    await this.interactor.click(this.locator);
  }

  /** Whether the switch is in a loading state (`aria-busy="true"`). */
  async isBusy(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-busy')) === 'true';
  }

  /** Whether the switch is required (`aria-required="true"`). */
  async isRequired(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-required')) === 'true';
  }

  /** The switch's visible label, resolved via the `<label for>`↔`id` link. */
  async getLabel(): Promise<Optional<string>> {
    return resolveLinkedLabelText(this.interactor, this.locator);
  }

  /**
   * The control's size token (`'sm'` | `'md'`), added in Astryx 0.2.0 to match
   * CheckboxInput and RadioList.
   *
   * The size rides on the switch's *painted track*, not on the `<input>` this
   * driver anchors — the track is the element carrying the theming target, and it
   * is the input's `aria-hidden` sibling. CSS has no parent axis here, so the
   * track is resolved from the document by the input's own `id`, the same shape
   * `FileInputDriver` uses to reach its trigger. `undefined` on an Astryx old
   * enough not to emit the attribute.
   */
  async getSize(): Promise<Optional<string>> {
    const inputId = await this.interactor.getAttribute(this.locator, 'id');
    if (!inputId) {
      return undefined;
    }
    const track = byCssSelector(`div:has(> input[id="${inputId}"]) > div[data-size]`, 'Root');
    if (!(await this.interactor.exists(track))) {
      return undefined;
    }
    return this.interactor.getAttribute(track, 'data-size');
  }

  /**
   * The `disabledMessage` tooltip text, shown when the switch is disabled with
   * a reason. Resolved through the native `<input>`'s composed
   * `aria-describedby` — the id list also carries the description/status-message
   * ids, so this picks out whichever target has `role="tooltip"`. `undefined`
   * when the switch has no disabled-reason tooltip.
   */
  async getDisabledMessage(): Promise<Optional<string>> {
    return resolveDescribedByRoleText(this.interactor, this.locator, 'aria-describedby', 'tooltip');
  }

  override get driverName(): string {
    return 'AstryxSwitchDriver';
  }
}
