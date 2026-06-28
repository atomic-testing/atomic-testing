import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byCssSelector, ComponentDriver, listHelper, locatorUtil, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx InputGroup (`@astryxdesign/core/InputGroup`).
 *
 * InputGroup self-emits `data-testid` on its inner `role="group"` div (anchored
 * by the scene), which also carries the accessible name (`aria-label`). The group
 * holds prefix/suffix addons (`InputGroupText` → plain `<div>`) alongside the
 * input wrapper (`<div data-pressable-container>`); addons are the non-wrapper
 * child divs.
 */
export class InputGroupDriver extends ComponentDriver<{}> {
  /** The group's accessible name (`aria-label`). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** Texts of the prefix/suffix addons, in DOM order. */
  async getAddonTexts(): Promise<string[]> {
    const addonLocator = locatorUtil.append(this.locator, byCssSelector('div:not([data-pressable-container])'));
    const texts: string[] = [];
    for await (const addon of listHelper.getListItemIterator(this, addonLocator, HTMLElementDriver)) {
      const text = await addon.getText();
      if (text != null && text.trim() !== '') {
        texts.push(text.trim());
      }
    }
    return texts;
  }

  get driverName(): string {
    return 'AstryxInputGroupDriver';
  }
}
