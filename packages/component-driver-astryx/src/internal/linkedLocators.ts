import { byLinkedElement, PartLocator } from '@atomic-testing/core';

/**
 * Internal locator builders shared by Astryx field controls.
 *
 * Astryx wires a control to its visible label and its status/description message
 * by native accessibility links rather than DOM nesting, so drivers anchored on
 * the control reach those elements by resolving the link — never by a
 * StyleX-hashed class or a positional selector.
 */

/**
 * Locate the `<label for={id}>` associated with a control by matching the
 * control's own `id` (`<label for>`↔`<control id>`).
 */
export function linkedLabelLocator(controlLocator: PartLocator): PartLocator {
  return byLinkedElement('Root').onLinkedElement(controlLocator).extractAttribute('id').toMatchMyAttribute('for');
}

/**
 * Locate the element a control points at via `aria-describedby`
 * (`<control aria-describedby>`↔`<message id>`).
 */
export function linkedDescribedByLocator(controlLocator: PartLocator): PartLocator {
  return byLinkedElement('Root')
    .onLinkedElement(controlLocator)
    .extractAttribute('aria-describedby')
    .toMatchMyAttribute('id');
}
