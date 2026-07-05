import {
  byRole,
  ComponentDriver,
  IDisableableDriver,
  IRequirableDriver,
  IToggleDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

/**
 * Driver for the Angular Material slide toggle (`MatSlideToggle`).
 *
 * Locate it by the `<mat-slide-toggle>` host element. Unlike checkbox/radio,
 * the widget is a `<button role="switch">` (no native input), so all state is
 * read off the ARIA contract: `aria-checked` for the on/off state,
 * `aria-required` for requiredness, and `disabled`/`aria-disabled` for the
 * disabled state.
 *
 * @see https://material.angular.dev/components/slide-toggle
 */
export class SlideToggleDriver
  extends ComponentDriver<{}>
  implements IToggleDriver, IDisableableDriver, IRequirableDriver
{
  private get switchLocator(): PartLocator {
    return locatorUtil.append(this.locator, byRole('switch'));
  }

  /**
   * Whether the toggle is on, i.e. the switch carries `aria-checked="true"`.
   */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.switchLocator, 'aria-checked')) === 'true';
  }

  /**
   * Turn the toggle on or off by clicking the switch when its current state
   * differs from the desired one. The click's effect on `aria-checked` lands
   * with Angular's change detection, so the new state is probed (bounded)
   * rather than assumed — a straight follow-up read can beat the update under
   * load.
   */
  async setSelected(selected: boolean): Promise<void> {
    if ((await this.isSelected()) !== selected) {
      await this.interactor.click(this.switchLocator);
      await this.interactor.waitUntil({
        probeFn: () => this.isSelected(),
        terminateCondition: selected,
        timeoutMs: 1000,
      });
    }
  }

  /**
   * Whether the toggle is disabled. A plain disabled toggle carries the native
   * `disabled` attribute on the switch button; with `disabledInteractive` the
   * button stays focusable and signals its state via `aria-disabled="true"`
   * instead. Treat either as disabled.
   */
  async isDisabled(): Promise<boolean> {
    if (await this.interactor.isDisabled(this.switchLocator)) {
      return true;
    }
    return (await this.interactor.getAttribute(this.switchLocator, 'aria-disabled')) === 'true';
  }

  /**
   * Whether the toggle is required. The switch is a button, so Material
   * signals requiredness via `aria-required="true"` (there is no native
   * `required` attribute to reflect).
   */
  isRequired(): Promise<boolean> {
    return this.interactor.isRequired(this.switchLocator);
  }

  /**
   * The text of the toggle's label, or `undefined` when it has no label
   * content. Material associates the label with the switch button via
   * `<label for>`↔`id`, so the driver resolves that link rather than assuming
   * a DOM shape.
   */
  getLabel(): Promise<Optional<string>> {
    return resolveLinkedLabelText(this.interactor, this.switchLocator);
  }

  get driverName(): string {
    return 'AngularMaterialV21SlideToggleDriver';
  }
}
