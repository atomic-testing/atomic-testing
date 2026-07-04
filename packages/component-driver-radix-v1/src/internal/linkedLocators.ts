import { byLinkedElement, Interactor, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Internal locator builder shared by Radix controls that render a bare
 * `<button>`/`<div>` widget with no wrapping `<label>` of their own (Checkbox,
 * Switch, RadioGroup.Item). Radix leaves the label association to the
 * consumer — most commonly `Label.Root`'s native `for`/`id` link — so the
 * label lives outside the control's own subtree and must be resolved through
 * the accessibility link rather than DOM nesting (mirrors the Astryx
 * `linkedLabelLocator` helper for the same reason).
 */
export function linkedLabelLocator(controlLocator: PartLocator): PartLocator {
  return byLinkedElement('Root').onLinkedElement(controlLocator).extractAttribute('id').toMatchMyAttribute('for');
}

/**
 * Resolve the visible text of the `<label for>` linked to a control, or
 * `undefined` when the control has no associated label. Guards on the
 * control's own `id` first: `byLinkedElement` throws (rather than resolving
 * to "no match") when the attribute it needs to extract is absent, so a
 * control with no `id` at all — a legitimate, unlabeled case — must be
 * short-circuited before ever building the linked locator.
 */
export async function resolveLinkedLabelText(
  interactor: Interactor,
  controlLocator: PartLocator
): Promise<Optional<string>> {
  const id = await interactor.getAttribute(controlLocator, 'id');
  if (!id) {
    return undefined;
  }
  const label = linkedLabelLocator(controlLocator);
  return (await interactor.exists(label)) ? interactor.getText(label) : undefined;
}
