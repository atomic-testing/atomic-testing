import {
  byTagName,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { ButtonDriver } from './ButtonDriver';

/**
 * Driver for the Astryx ButtonGroup (`@astryxdesign/core/ButtonGroup`).
 *
 * ButtonGroup renders a `role="group"` root that self-emits `data-testid` and
 * carries the accessible name (`aria-label`) and orientation (`data-orientation`
 * — Astryx 0.1.3 dropped the invalid `aria-orientation`, which axe flagged as
 * disallowed on `role="group"`); its children are plain `<button>`s. Modelled as
 * a list of {@link ButtonDriver}s located by tag — the group's own `aria-label`
 * is read off the root, not confused with a child button's name.
 *
 * The default `itemClass`/`itemLocator` are merged ahead of the engine-supplied
 * option so they survive even though the engine always passes a defined option.
 */
export class ButtonGroupDriver extends ListComponentDriver<ButtonDriver> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { itemClass: ButtonDriver, itemLocator: byTagName('button'), ...option });
  }

  /** The group's accessible name (`aria-label`). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** The group's orientation (`data-orientation`), e.g. `'horizontal'`/`'vertical'`. */
  async getOrientation(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-orientation');
  }

  /** Number of buttons in the group. */
  async getButtonCount(): Promise<number> {
    return this.getItemCount();
  }

  /**
   * Click the button whose visible text matches `name`.
   * @returns `false` when no button with that name exists.
   */
  async clickButton(name: string): Promise<boolean> {
    const button = await this.getItemByLabel(name);
    if (button == null) {
      return false;
    }
    await button.click();
    return true;
  }

  override get driverName(): string {
    return 'AstryxButtonGroupDriver';
  }
}
