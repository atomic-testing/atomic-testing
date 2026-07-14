import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `Label` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders a plain native
 * `<label class="fui-Label">` — its behavior is standard native `<label for>`
 * semantics, so the driver surface is just the linked control's `id`
 * (`getFor`) and the label's own text (`getText`, inherited from
 * `ComponentDriver`).
 */
export class LabelDriver extends ComponentDriver<{}> {
  /** The `for` attribute — the `id` of the control this label is linked to, or `undefined`. */
  async getFor(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'for');
  }

  get driverName(): string {
    return 'FluentV9LabelDriver';
  }
}
