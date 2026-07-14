import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `Image` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders a plain native
 * `<img class="fui-Image">` — the component root IS the image, so `src`/`alt`
 * are direct attribute reads.
 */
export class ImageDriver extends ComponentDriver<{}> {
  /** The `src` attribute, or `undefined` when absent. */
  async getSrc(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'src');
  }

  /** The `alt` attribute, or `undefined` when absent. */
  async getAlt(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'alt');
  }

  get driverName(): string {
    return 'FluentV9ImageDriver';
  }
}
