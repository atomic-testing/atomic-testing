import {
  byAriaLabel,
  byAttribute,
  byTagName,
  ComponentDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

/**
 * Driver for the Astryx ToggleButtonGroup (`@astryxdesign/core/ToggleButton`).
 *
 * ToggleButtonGroup renders a `role="group"` root that self-emits `data-testid`
 * and carries the group's accessible name; its children are `<button>`s that each
 * always set an explicit `aria-label` and report selection via `aria-pressed`.
 * The buttons' visible text is duplicated (a width-reservation trick), so items
 * are addressed by their verbatim `aria-label`, never by `getText`.
 */
export class ToggleButtonGroupDriver extends ComponentDriver<{}> {
  private buttonLocator(name: string): PartLocator {
    return locatorUtil.append(this.locator, byTagName('button'), byAriaLabel(name, 'Same'));
  }

  /** The group's accessible name (`aria-label`). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** Whether the toggle named `name` is pressed (`aria-pressed="true"`). */
  async isSelected(name: string): Promise<boolean> {
    return (await this.interactor.getAttribute(this.buttonLocator(name), 'aria-pressed')) === 'true';
  }

  /** Accessible names of every pressed toggle, in DOM order. */
  async getSelectedLabels(): Promise<readonly string[]> {
    const pressed = locatorUtil.append(this.locator, byTagName('button'), byAttribute('aria-pressed', 'true', 'Same'));
    const labels = await this.interactor.getAttribute(pressed, 'aria-label', true);
    return labels.filter((l): l is string => l != null);
  }

  /** Number of toggle buttons in the group. */
  async getItemCount(): Promise<number> {
    const buttons = locatorUtil.append(this.locator, byTagName('button'));
    const types = await this.interactor.getAttribute(buttons, 'type', true);
    return types.length;
  }

  /** Press the toggle named `name` if it is not already pressed. */
  async select(name: string): Promise<void> {
    if (!(await this.isSelected(name))) {
      await this.interactor.click(this.buttonLocator(name));
    }
  }

  /** Release the toggle named `name` if it is currently pressed. */
  async deselect(name: string): Promise<void> {
    if (await this.isSelected(name)) {
      await this.interactor.click(this.buttonLocator(name));
    }
  }

  get driverName(): string {
    return 'AstryxToggleButtonGroupDriver';
  }
}
