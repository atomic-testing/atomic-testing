import { byAttribute, byLinkedElement, Interactor, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Internal locator builders shared by Astryx controls.
 *
 * Astryx wires a control to its visible label, its status/description message,
 * and its floating layers by native accessibility links (`<label for>`,
 * `aria-describedby`, `aria-controls`) rather than DOM nesting, so drivers
 * anchored on the control reach those elements by resolving the link — never by a
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

/**
 * Resolve the text of the element a control points at through a single-IDREF
 * attribute (`aria-describedby` → a body-level layer, `aria-controls` → a panel).
 * The id is matched through the escaping `byAttribute` builder rather than raw
 * `[id="…"]` interpolation, and the lookup re-roots at the document (`'Root'`)
 * because these layers render outside the control's subtree.
 *
 * Shared by the overlay drivers whose floating layer has no role/testid of its
 * own (HoverCard, Tooltip). Returns `undefined` when the attribute is absent or
 * the target is missing.
 */
export async function resolveLinkedElementText(
  interactor: Interactor,
  controlLocator: PartLocator,
  idRefAttribute: string
): Promise<Optional<string>> {
  const id = await interactor.getAttribute(controlLocator, idRefAttribute);
  if (!id) {
    return undefined;
  }
  const target = byAttribute('id', id, 'Root');
  if (!(await interactor.exists(target))) {
    return undefined;
  }
  return (await interactor.getText(target)) ?? undefined;
}
