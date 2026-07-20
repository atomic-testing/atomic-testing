import { byCssClass, ComponentDriver, Optional } from '@atomic-testing/core';

import { readOptionalDescendantText } from '../internal/optionalText';

const titleLocator = byCssClass('fui-MessageBarTitle');
const bodyLocator = byCssClass('fui-MessageBarBody');

/**
 * Driver for the Fluent v9 `MessageBar` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders
 * `<div role="group" aria-labelledby="{titleId}">` wrapping a
 * `<div class="fui-MessageBarBody">` (containing an optional
 * `<span class="fui-MessageBarTitle">`, then the rest of the body text as a
 * sibling text node) and a `<div class="fui-MessageBarActions">`.
 * {@link getBodyText} reads the WHOLE `fui-MessageBarBody` — since `Title`
 * nests INSIDE `Body` rather than beside it, this includes the title text
 * too (no CSS/`textContent` read can exclude a nested element's text from an
 * ancestor's), the same class of limitation as
 * `CompoundButtonDriver.getSecondaryContent()`; use {@link getTitle} for the
 * exact title alone. `intent`/`shape`/`politeness` have no un-hashed DOM
 * reflection. No built-in dismiss — like `ToastDriver`, declare the
 * consumer-supplied action button (`MessageBarActions`' `containerAction`
 * slot) as its own scene part.
 */
export class MessageBarDriver extends ComponentDriver<{}> {
  /** The message's title (`MessageBarTitle`), or `undefined` when none is rendered. */
  async getTitle(): Promise<Optional<string>> {
    return readOptionalDescendantText(this.interactor, this.locator, titleLocator);
  }

  /** The full body text, INCLUDING the title's text when present (see class doc). */
  async getBodyText(): Promise<Optional<string>> {
    return readOptionalDescendantText(this.interactor, this.locator, bodyLocator);
  }

  get driverName(): string {
    return 'FluentV9MessageBarDriver';
  }
}
