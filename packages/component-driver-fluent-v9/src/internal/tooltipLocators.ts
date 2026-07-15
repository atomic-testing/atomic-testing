import { byLinkedElement, PartLocator } from '@atomic-testing/core';

/**
 * The portalled tooltip content (`role="tooltip"`, class `fui-Tooltip__content`)
 * linked from its trigger's `aria-describedby`, followed at call time via
 * `byLinkedElement`.
 *
 * DOM audit (@fluentui/react-components@9.74.3): `Tooltip`'s default
 * `relationship="label"` sets `aria-label` directly on the trigger and links
 * nothing — the accessible name IS the tooltip text, so no content lookup is
 * needed at all in that mode (see {@link TooltipDriver.getContent}). Only
 * `relationship="description"` adds `aria-describedby` on the trigger pointing
 * at the portalled content's `id` — present from mount, not only while the
 * tooltip is visually shown (see `TooltipDriver`'s class doc for the
 * always-mounted DOM audit). `byLinkedElement` throws when the attribute it
 * must extract (`aria-describedby`) is itself absent — i.e. in the default
 * `"label"` relationship, or when the trigger has no tooltip at all — callers
 * must guard for that rather than let it surface.
 */
export function tooltipContentLocator(triggerLocator: PartLocator): PartLocator {
  return byLinkedElement('Root')
    .onLinkedElement(triggerLocator)
    .extractAttribute('aria-describedby')
    .toMatchMyAttribute('id');
}
