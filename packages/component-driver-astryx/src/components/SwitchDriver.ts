import { HTMLCheckboxDriver } from '@atomic-testing/component-driver-html';
import { Optional } from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

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

  override get driverName(): string {
    return 'AstryxSwitchDriver';
  }
}
