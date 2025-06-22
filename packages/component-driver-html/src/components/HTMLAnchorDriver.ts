import {
  ClickOption,
  ComponentDriver,
  HoverOption,
  IClickableDriver,
  IMouseInteractableDriver,
  Optional,
} from '@atomic-testing/core';

export class HTMLAnchorDriver extends ComponentDriver<{}> implements IClickableDriver, IMouseInteractableDriver {
  /**
   * Trigger a click on the anchor element.
   */
  async click(option?: ClickOption): Promise<void> {
    await this.interactor.click(this.locator, option);
  }

  /**
   * Hover over the anchor element.
   */
  async hover(option?: HoverOption): Promise<void> {
    await this.interactor.hover(this.locator, option);
  }

  /**
   * Retrieve the link's `href` attribute.
   */
  async getHref(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'href');
  }

  /**
   * Retrieve the link's `target` attribute.
   */
  async getTarget(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'target');
  }

  /**
   * Identifier for this driver.
   */
  get driverName(): string {
    return 'HTMLAnchorDriver';
  }
}
