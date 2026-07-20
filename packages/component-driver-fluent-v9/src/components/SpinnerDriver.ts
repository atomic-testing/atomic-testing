import { byCssClass, ComponentDriver, Optional } from '@atomic-testing/core';

import { readOptionalDescendantText } from '../internal/optionalText';

const labelLocator = byCssClass('fui-Spinner__label');

/**
 * Driver for the Fluent v9 `Spinner` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders
 * `<div role="progressbar">` around the animated ring plus an optional
 * `<label class="fui-Spinner__label">` for the `label` slot — the inherited
 * whole-root `getText()` would read the (visually hidden) ring markup along
 * with the label, so {@link getLabel} reads the label's own structural class
 * instead. `delay`/`appearance`/`size` have no DOM reflection to read back.
 */
export class SpinnerDriver extends ComponentDriver<{}> {
  /** The spinner's label text, or `undefined` when rendered without one. */
  async getLabel(): Promise<Optional<string>> {
    return readOptionalDescendantText(this.interactor, this.locator, labelLocator);
  }

  get driverName(): string {
    return 'FluentV9SpinnerDriver';
  }
}
