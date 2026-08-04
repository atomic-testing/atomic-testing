/**
 * Environment-agnostic checked/disabled policy shared by `DOMInteractor` and
 * `PlaywrightInteractor` so the two cannot drift, the same way
 * `visibilityUtil.isElementVisibleByStyle` is shared (#1053).
 *
 * Before this existed the two engines answered differently and neither answer was
 * written down: the DOM leg read only native IDL properties, while the Playwright
 * leg delegated to Playwright's own primitives, which follow labels, consult
 * `aria-checked`, honour a disabled `<fieldset>`/`<optgroup>`, and walk ancestors
 * for `aria-disabled`. Any test asserting a design-system control's state got a
 * different answer per runner. Defining the predicate once and running it in both
 * places makes them agree by construction rather than by parallel maintenance.
 *
 * Both functions are passed BY VALUE into Playwright's `page.evaluate`, which
 * serializes them to the browser. They must therefore stay self-contained: they may
 * reference only their parameters and DOM globals, never an import, a module-scope
 * constant, or a Node object — which is why the role list below is inlined rather
 * than hoisted. Keep them synchronous and free of constructs that transpile to
 * injected runtime helpers.
 */

/**
 * Whether the element is checked, via the native `checked` property of an
 * `<input type="checkbox">`/`<input type="radio">`, or `aria-checked="true"` on an
 * element whose explicit `role` is a checkable one.
 *
 * `aria-checked="mixed"` and a native `indeterminate` control both report `false`:
 * this contract is two-state, and "partially checked" is not "checked". An element
 * that cannot be checked at all reports `false` rather than throwing, so the read
 * stays total in both engines.
 *
 * @param element - The element whose checked state is being decided. It must be the
 *   control itself; a `<label>` pointing at one is not retargeted.
 */
export function isElementChecked(element: Element): boolean {
  if (element.nodeName === 'INPUT') {
    const input = element as HTMLInputElement;
    const type = typeof input.type === 'string' ? input.type.toLowerCase() : '';
    if (type === 'checkbox' || type === 'radio') {
      return input.checked === true;
    }
  }
  // Only an EXPLICIT role is consulted. Every implicit role that supports
  // aria-checked belongs to a native control the branch above already answered, so
  // computing implicit roles would add cost without changing a single answer.
  const role = element.getAttribute('role');
  const checkableRoles = ['checkbox', 'radio', 'menuitemcheckbox', 'menuitemradio', 'switch', 'treeitem'];
  if (role !== null && checkableRoles.indexOf(role) !== -1) {
    return element.getAttribute('aria-checked') === 'true';
  }
  return false;
}

/**
 * Whether the element is disabled, via the native disabled state — including the
 * `<fieldset disabled>` and `<optgroup disabled>` cascades the HTML spec defines —
 * or the nearest `aria-disabled` on the element or an ancestor being `"true"`.
 *
 * The nearest explicit `aria-disabled` wins, so a re-enabled descendant of a
 * disabled container reports `false`. An element with no disabled semantics at all
 * reports `false` rather than throwing, so the read stays total in both engines.
 *
 * @param element - The element whose disabled state is being decided. It must be the
 *   control itself; a `<label>` pointing at one is not retargeted.
 */
export function isElementDisabled(element: Element): boolean {
  // `:disabled` is the spec's own definition of "actually disabled", so it covers
  // the fieldset cascade and its `<legend>` carve-out for free. It is also narrower
  // than the `'disabled' in element` test it replaces, which reported a
  // `<link disabled>` stylesheet as a disabled control.
  if (element.matches(':disabled')) {
    return true;
  }
  const ariaHost = element.closest('[aria-disabled]');
  return ariaHost !== null && ariaHost.getAttribute('aria-disabled') === 'true';
}
