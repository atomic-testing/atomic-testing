import { byCssSelector, Optional } from '@atomic-testing/core';

import { readOptionalDescendantText } from '../internal/optionalText';
import { ButtonDriver } from './ButtonDriver';

const secondaryContentLocator = byCssSelector('.fui-CompoundButton__secondaryContent');

/**
 * Driver for the Fluent v9 `CompoundButton` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): still a native
 * `<button class="fui-Button fui-CompoundButton">`, so `ButtonDriver`'s whole
 * surface applies unchanged. The primary label and `secondaryContent` render
 * as adjacent text inside one `fui-CompoundButton__contentContainer` span
 * (`<span>Primary<span class="...secondaryContent">Secondary</span></span>`)
 * with no separating whitespace — CSS/`textContent` cannot exclude a nested
 * element's text from its ancestor's read, so the inherited `getText()`
 * returns the primary and secondary text concatenated. {@link getSecondaryContent}
 * reads just the secondary part via Fluent's own structural class; splitting
 * out the primary-only text would need a capability this locator model does
 * not have (partial/direct-child text extraction) and is left as a known gap.
 */
export class CompoundButtonDriver extends ButtonDriver {
  /** The secondary content line, or `undefined` when the button renders none. */
  getSecondaryContent(): Promise<Optional<string>> {
    return readOptionalDescendantText(this.interactor, this.locator, secondaryContentLocator);
  }

  override get driverName(): string {
    return 'FluentV9CompoundButtonDriver';
  }
}
