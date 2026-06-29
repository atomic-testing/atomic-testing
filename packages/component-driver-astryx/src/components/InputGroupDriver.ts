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
    // Addons are the group's direct child `<div>`s other than the input wrapper
    // (`[data-pressable-container]`). Enumerate ALL direct child divs so the index
    // iteration's `:nth-of-type` counts them contiguously, then skip the wrapper
    // in the loop — excluding it in the selector instead desyncs from
    // `:nth-of-type` and silently drops a trailing (suffix) addon.
    const childDivs = locatorUtil.append(this.locator, byCssSelector('> div'));
    const texts: string[] = [];
    for await (const child of listHelper.getListItemIterator(this, childDivs, HTMLElementDriver)) {
      if ((await child.getAttribute('data-pressable-container')) != null) {
        continue;
      }
      const text = await child.getText();
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
