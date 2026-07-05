import { byLinkedElement, PartLocator } from '@atomic-testing/core';

/**
 * Document-rooted locator for the element whose `id` is named by an ARIA
 * id-reference attribute (`aria-controls`, `aria-labelledby`, …) on a source
 * element. PrimeVue's published accessibility contract links every overlay to
 * its trigger this way (e.g. the Select combobox's `aria-controls` names the
 * teleported listbox's `id`), which pins the portalled surface precisely —
 * no "assume one open overlay at a time" fallback needed, unlike the Radix
 * and MUI select drivers, whose DOM offers no such link.
 *
 * `sourceLocator` is resolved RELATIVE to the chain the returned locator is
 * appended to (`locatorUtil` prepends the surrounding chain as context when
 * resolving a linked locator) — so when the result is used as a driver part,
 * pass the source as a plain descendant of that driver's root (e.g.
 * `byRole('combobox')`), never as a full engine-rooted chain.
 *
 * `byLinkedElement` throws (rather than resolving to "no match") when the
 * source attribute is absent, so callers must guard with a
 * `getAttribute(source, attribute)` null-check before resolving a locator
 * built here (same caveat the Radix `linkedLocators` helper documents).
 */
export function byAriaIdReference(sourceLocator: PartLocator, idReferenceAttribute: string): PartLocator {
  return byLinkedElement('Root')
    .onLinkedElement(sourceLocator)
    .extractAttribute(idReferenceAttribute)
    .toMatchMyAttribute('id');
}
