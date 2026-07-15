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
 * at the portalled content's `id`, present only while the tooltip is shown.
 * `byLinkedElement` throws when the attribute it must extract
 * (`aria-describedby`) is itself absent — i.e. whenever the tooltip is closed,
 * or open in the default `"label"` relationship — callers must guard for that
 * rather than let it surface.
 */
export function tooltipContentLocator(triggerLocator: PartLocator): PartLocator {
  return byLinkedElement('Root')
    .onLinkedElement(triggerLocator)
    .extractAttribute('aria-describedby')
    .toMatchMyAttribute('id');
}
