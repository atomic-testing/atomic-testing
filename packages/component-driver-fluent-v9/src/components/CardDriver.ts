import {
  byCssClass,
  ComponentDriver,
  IDisableableDriver,
  IToggleDriver,
  locatorUtil,
  Optional,
} from '@atomic-testing/core';

import { readOptionalDescendantText } from '../internal/optionalText';

const checkboxLocator = byCssClass('fui-Card__checkbox');
const headerTitleLocator = byCssClass('fui-CardHeader__header');
const headerDescriptionLocator = byCssClass('fui-CardHeader__description');
const footerLocator = byCssClass('fui-CardFooter');
const previewLocator = byCssClass('fui-CardPreview');

/**
 * Driver for the Fluent v9 `Card` component (folding `CardHeader`/
 * `CardFooter`/`CardPreview` reads directly, the same "single composite
 * driver" shape `DialogDriver`/`TeachingPopoverDriver` use for their own
 * single, non-repeating children — none of the three are independently
 * addressable/interactive the way a repeated list item is).
 *
 * DOM audit (@fluentui/react-components@9.74.3): root is always
 * `<div role="group">` regardless of `selectable`/`disabled`. A selectable
 * card (`selected`/`onSelectionChange` supplied) additionally renders a REAL
 * native `<input type="checkbox" class="fui-Card__checkbox">` as its first
 * child, driven directly via `Interactor.isChecked`/`click` rather than
 * delegating to `HTMLCheckboxDriver` (composing a second driver instance
 * would add indirection with no reuse benefit for two one-line reads).
 * `disabled` sets `aria-disabled="true"` on the root AND the native
 * `disabled` attribute on the checkbox — {@link isDisabled} reads the root's
 * `aria-disabled` (same convention as `LinkDriver`), consistent regardless of
 * whether the card is selectable.
 */
export class CardDriver extends ComponentDriver<{}> implements IDisableableDriver, IToggleDriver {
  /** Whether the card is disabled, read from the root's `aria-disabled` (present regardless of `selectable`). */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  /** Whether this card renders a selection checkbox at all (`selectable` usage, i.e. `onSelectionChange` supplied). */
  async isSelectable(): Promise<boolean> {
    return this.interactor.exists(locatorUtil.append(this.locator, checkboxLocator));
  }

  /** Whether the card is currently selected. `false` when the card isn't selectable at all. */
  async isSelected(): Promise<boolean> {
    if (!(await this.isSelectable())) {
      return false;
    }
    return this.interactor.isChecked(locatorUtil.append(this.locator, checkboxLocator));
  }

  /** Toggle selection by clicking the card. No-ops when the card isn't selectable or is disabled. */
  async setSelected(selected: boolean): Promise<void> {
    if (!(await this.isSelectable()) || (await this.isDisabled())) {
      return;
    }
    const currentSelected = await this.isSelected();
    if (currentSelected === selected) {
      return;
    }
    await this.click();
  }

  /** The `CardHeader`'s title text (its `header` slot), or `undefined` when no header is rendered. */
  async getHeaderTitle(): Promise<Optional<string>> {
    return readOptionalDescendantText(this.interactor, this.locator, headerTitleLocator);
  }

  /** The `CardHeader`'s description text (its `description` slot), or `undefined` when absent. */
  async getHeaderDescription(): Promise<Optional<string>> {
    return readOptionalDescendantText(this.interactor, this.locator, headerDescriptionLocator);
  }

  /** The `CardFooter`'s text, or `undefined` when no footer is rendered. */
  async getFooterText(): Promise<Optional<string>> {
    return readOptionalDescendantText(this.interactor, this.locator, footerLocator);
  }

  /** Whether a `CardPreview` is rendered. Preview content is arbitrary consumer UI with no fixed semantic state to read. */
  async hasPreview(): Promise<boolean> {
    return this.interactor.exists(locatorUtil.append(this.locator, previewLocator));
  }

  get driverName(): string {
    return 'FluentV9CardDriver';
  }
}
