import { byCssClass, ComponentDriver, Optional } from '@atomic-testing/core';

import { readOptionalDescendantText } from '../internal/optionalText';

const primaryTextLocator = byCssClass('fui-Tag__primaryText');

/**
 * Driver for the Fluent v9 `Tag` (`@fluentui/react-tags`, re-exported from
 * `@fluentui/react-components`) — the STATIC, non-dismissible tag. See
 * {@link InteractionTagDriver} for the dismissible composed variant.
 *
 * DOM audit (@fluentui/react-components@9.74.3): the `data-testid`/locator you
 * put on `<Tag>` forwards straight to the component's own root
 * `<span class="fui-Tag">` (a `<button>` only when the undocumented-for-this-
 * wave `dismissible` prop is set — out of scope here, see `InteractionTag` for
 * the supported dismissible shape); its visible text always renders inside a
 * child `<span class="fui-Tag__primaryText">` (Fluent's own un-hashed
 * structural "part" class, rendered by default even for an empty `<Tag />`),
 * so {@link getLabel} reads that part rather than the root's combined
 * `getText()` — a `Tag` can also carry `media`/`icon` slots whose own text
 * (an `Avatar`'s initials, say) would otherwise leak into a root-level read.
 *
 * `Tag`'s ROLE depends entirely on its parent `TagGroup`'s own `role` prop
 * (`option` inside a `role="listbox"` group, otherwise no role at all) rather
 * than anything intrinsic to `Tag` — see `TagGroupDriver`'s TSDoc — so no
 * role-based state is exposed here.
 *
 * **Known gap — no observable `disabled` state**: `Tag`'s `disabled` prop only
 * ever reaches Griffel's hashed style classes (verified against the rendered
 * DOM: a `<Tag disabled>` carries neither a `disabled` nor an `aria-disabled`
 * attribute — Fluent's `getIntrinsicElementProps` strips `disabled` for a
 * non-button root, since it isn't a valid native attribute for `<span>`, and
 * no ARIA mirror is stamped either). This is not a jsdom limitation — the same
 * filtering runs in a real browser — so, like `component-driver-astryx`'s
 * `TokenDriver.isDisabled` (a disabled state visible only via un-anchorable
 * hashed classes), this driver deliberately does not implement
 * `IDisableableDriver`.
 */
export class TagDriver extends ComponentDriver<{}> {
  /**
   * The tag's visible label (the `fui-Tag__primaryText` part, trimmed), or
   * `undefined` when that part is missing or empty (e.g. a childless `<Tag />`).
   */
  async getLabel(): Promise<Optional<string>> {
    const text = await readOptionalDescendantText(this.interactor, this.locator, primaryTextLocator);
    return text?.trim() || undefined;
  }

  get driverName(): string {
    return 'FluentV9TagDriver';
  }
}
