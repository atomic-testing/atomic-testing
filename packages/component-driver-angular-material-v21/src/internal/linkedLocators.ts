import { byLinkedElement, Interactor, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Angular Material labels its form controls (checkbox, radio, slide-toggle,
 * form-field) with a `<label for="…">` pointing at the control's auto-generated
 * `id` — the native accessibility association, which Material documents as its
 * supported contract (unlike the `.mat-mdc-*` internal DOM). These helpers
 * resolve that link; ids are document-unique, so the lookup is rooted at the
 * document rather than the driver subtree.
 */

/**
 * Locate the `<label for={id}>` associated with a control by matching the
 * control's own `id` (`<label for>`↔`<control id>`).
 */
export function linkedLabelLocator(controlLocator: PartLocator): PartLocator {
  return byLinkedElement('Root').onLinkedElement(controlLocator).extractAttribute('id').toMatchMyAttribute('for');
}

/**
 * Resolve the visible text of the `<label for>` linked to a control.
 *
 * Material renders the label element even when the component has no projected
 * label content, so an empty (or whitespace-only) label is reported as
 * `undefined` — "this control has no label" — matching the other driver
 * packages' `getLabel` contract. The required marker (`mdc-floating-label--required`
 * asterisk) is CSS-generated content, so it never leaks into the returned text.
 */
export async function resolveLinkedLabelText(
  interactor: Interactor,
  controlLocator: PartLocator
): Promise<Optional<string>> {
  const labelLocator = linkedLabelLocator(controlLocator);
  if (!(await interactor.exists(labelLocator))) {
    return undefined;
  }
  const text = (await interactor.getText(labelLocator))?.trim();
  return text === '' ? undefined : text;
}
