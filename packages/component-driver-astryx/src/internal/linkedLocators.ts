import { byLinkedElement, Interactor, Optional, PartLocator } from '@atomic-testing/core';

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
 * Resolve the visible text of the `<label for>` linked to a control, or
 * `undefined` when the control has no associated label.
 *
 * Shared by the field/checkbox/switch drivers, which expose `getLabel` but can't
 * inherit a single implementation (they extend different HTML base drivers).
 */
export async function resolveLinkedLabelText(
  interactor: Interactor,
  controlLocator: PartLocator
): Promise<Optional<string>> {
  const labelLocator = linkedLabelLocator(controlLocator);
  if (!(await interactor.exists(labelLocator))) {
    return undefined;
  }
  return (await interactor.getText(labelLocator)) ?? undefined;
}
