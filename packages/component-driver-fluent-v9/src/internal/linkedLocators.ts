import { byLinkedElement, Interactor, Optional, PartLocator } from '@atomic-testing/core';

import { readLabelText } from './labelText';

/**
 * Internal locator builder shared by Fluent v9 controls whose visible label is
 * a REAL native `<label for>` rendered as a SIBLING of the control within the
 * same wrapper (`fui-Checkbox`/`fui-Switch`/`fui-Radio`), not an ancestor or
 * descendant of the control's own locator — Fluent leaves the pairing to the
 * native `for`/`id` accessibility link rather than DOM nesting (same reason
 * Radix's `linkedLabelLocator` exists for its own button-based controls).
 */
export function linkedLabelLocator(controlLocator: PartLocator): PartLocator {
  return byLinkedElement('Root').onLinkedElement(controlLocator).extractAttribute('id').toMatchMyAttribute('for');
}

/**
 * Resolve the visible text of the `<label for>` linked to a control, or
 * `undefined` when the control has no associated label. Guards on the
 * control's own `id` first: `byLinkedElement` throws (rather than resolving to
 * "no match") when the attribute it needs to extract is absent, so a control
 * with no `id` at all — a legitimate, unlabeled case — must be short-circuited
 * before ever building the linked locator. Delegates the actual text read to
 * {@link readLabelText}, which also strips Fluent's required-marker `*` when
 * the control is required.
 */
export async function resolveLinkedLabelText(
  interactor: Interactor,
  controlLocator: PartLocator
): Promise<Optional<string>> {
  const id = await interactor.getAttribute(controlLocator, 'id');
  if (!id) {
    return undefined;
  }
  return readLabelText(interactor, linkedLabelLocator(controlLocator));
}
