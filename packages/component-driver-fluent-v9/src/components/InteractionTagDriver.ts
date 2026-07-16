import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  ComponentDriver,
  IComponentDriverOption,
  IDisableableDriver,
  Interactor,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { readOptionalDescendantText } from '../internal/optionalText';

export const interactionTagParts = {
  primary: { locator: byCssClass('fui-InteractionTagPrimary'), driver: HTMLButtonDriver },
  secondary: { locator: byCssClass('fui-InteractionTagSecondary'), driver: HTMLButtonDriver },
} satisfies ScenePart;

const primaryTextLocator = byCssClass('fui-InteractionTagPrimary__primaryText');

/**
 * Driver for the Fluent v9 `InteractionTag` (`InteractionTagPrimary` +
 * `InteractionTagSecondary`) — the DISMISSIBLE tag. See {@link TagDriver} for
 * the static, non-dismissible variant.
 *
 * DOM audit (@fluentui/react-components@9.74.3): unlike plain `Tag`,
 * `InteractionTag`'s root `<div class="fui-InteractionTag">` (where the scene
 * locator lands) wraps TWO real native `<button>`s — `InteractionTagPrimary`
 * (`fui-InteractionTagPrimary`, the label/select action) and
 * `InteractionTagSecondary` (`fui-InteractionTagSecondary`, the dismiss "X") —
 * so, unlike `Tag`, `disabled` DOES reach the DOM here: both buttons render a
 * real native `disabled` attribute (Fluent forwards `InteractionTag`'s
 * `disabled` prop through React context onto each), so this driver reuses
 * `HTMLButtonDriver` wholesale for both parts rather than reinventing
 * attribute reads (mirrors `SplitButtonDriver`'s primary/menu-button split).
 * The base `click()` inherited from `ComponentDriver` targets the
 * non-interactive wrapper `<div>`, so {@link clickPrimary}/{@link dismiss}
 * are exposed instead.
 *
 * Named `dismiss()` — matching Fluent's own `TagGroup`
 * `onDismiss`/`handleTagDismiss` terminology — rather than a generic
 * `clickSecondary()`; its shape (a plain click wrapper returning `Promise<void>`)
 * mirrors `component-driver-mui-v9`'s `ChipDriver.clickRemove()`.
 */
export class InteractionTagDriver extends ComponentDriver<typeof interactionTagParts> implements IDisableableDriver {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: interactionTagParts,
    });
  }

  /**
   * The tag's visible label — the `InteractionTagPrimary`'s own
   * `fui-InteractionTagPrimary__primaryText` part (a class distinct from plain
   * `Tag`'s `fui-Tag__primaryText`, hence not shared code with
   * {@link TagDriver.getLabel}), trimmed, or `undefined` when missing/empty.
   */
  async getLabel(): Promise<Optional<string>> {
    const text = await readOptionalDescendantText(this.interactor, this.parts.primary.locator, primaryTextLocator);
    return text?.trim() || undefined;
  }

  /** Whether the tag is disabled — reads the `InteractionTagPrimary` button's real native `disabled` attribute. */
  async isDisabled(): Promise<boolean> {
    return this.parts.primary.isDisabled();
  }

  /** Click the primary action (the label button) — selects the tag, does not dismiss it. */
  async clickPrimary(): Promise<void> {
    await this.parts.primary.click();
  }

  /** Dismiss (remove) the tag by clicking its `InteractionTagSecondary` "X" button. */
  async dismiss(): Promise<void> {
    await this.parts.secondary.click();
  }

  get driverName(): string {
    return 'FluentV9InteractionTagDriver';
  }
}
