/**
 * Environment-agnostic **element-state policy** shared by `DOMInteractor` and
 * `PlaywrightInteractor`, so the two cannot drift (#1053 set this precedent for
 * visibility in `visibilityUtil`; this module extends it to the boolean state
 * reads). Each predicate is the single source of truth for what one
 * {@link ElementQueries} boolean means; the interactors only supply the element.
 *
 * WHY a shared predicate rather than two implementations: before this module,
 * `isChecked`/`isDisabled` were written twice and answered differently for the
 * same DOM — jsdom inspected native properties only, while Playwright ran its
 * own ARIA-aware, throw-on-mismatch logic. Same markup, different result (and in
 * one case an exception instead of a value), which breaks the library's promise
 * that one suite runs identically in both environments.
 *
 * **Reads never throw.** A predicate applied to an element the state does not
 * apply to (`isElementChecked` on a `<div>`) answers `false` — the convention
 * every other `ElementQueries` member follows. Absence is handled by the caller
 * (a missing element is `false` before a predicate is ever reached).
 *
 * **Serialization contract.** Every exported predicate here is passed BY VALUE
 * into Playwright's `evaluate`, which stringifies it into the browser. Each must
 * therefore stay self-contained: it may reference only its own parameters and
 * DOM globals — never an import, never a module-scope helper (not even one
 * declared in this file), never a Node object. Keep them synchronous and free of
 * syntax that transpiles to injected runtime helpers. That is why the ancestor
 * walks below are inlined rather than factored into a shared local function.
 */

/**
 * Whether the element is checked.
 *
 * Policy, in order:
 * 1. A native checkbox/radio `<input>` answers with its live `checked` property,
 *    so a click-driven toggle is observed rather than the stale `checked`
 *    *attribute*. The native signal wins outright — an `aria-checked` on a
 *    native control is decoration, not state.
 * 2. Anything else answers `aria-checked === "true"`, which covers custom
 *    widgets (`role="checkbox"`, `"radio"`, `"switch"`, `"menuitemcheckbox"`, …)
 *    without this module needing a role engine. `aria-checked="mixed"` is NOT
 *    checked — this is a two-state predicate, and "partially checked" is not
 *    "checked".
 * 3. Everything else — including an element with no checkable semantics at all —
 *    is `false`. It never throws: `PlaywrightInteractor` used to surface
 *    Playwright's `Not a checkbox or radio button` error here while jsdom
 *    quietly answered `false`.
 *
 * @param element - The element whose checked state is being decided.
 */
export function isElementChecked(element: Element): boolean {
  if (element.tagName === 'INPUT') {
    const type = (element.getAttribute('type') || '').toLowerCase();
    if (type === 'checkbox' || type === 'radio') {
      return (element as HTMLInputElement).checked === true;
    }
  }
  return element.getAttribute('aria-checked') === 'true';
}

/**
 * Whether the element is disabled.
 *
 * Policy — disabled when ANY of the following holds, otherwise `false`:
 * 1. **Native, own.** The element is a form control (`button`, `input`,
 *    `select`, `textarea`, `option`, `optgroup`, `fieldset`) carrying the
 *    `disabled` attribute. A bare `disabled` attribute on a non-form-control
 *    (`<div disabled>`) is inert in HTML and is NOT a disabling signal here
 *    either — such a widget declares itself disabled through `aria-disabled`.
 * 2. **Native, inherited.** A form control inside a `<fieldset disabled>` is
 *    disabled, EXCEPT when it sits inside that fieldset's first `<legend>` (the
 *    HTML "actually disabled" carve-out that keeps a legend's own controls
 *    usable). An `<option>` inside an `<optgroup disabled>` is likewise
 *    disabled. Neither is reflected by the `disabled` IDL property, which
 *    mirrors only the element's own attribute — which is exactly why jsdom
 *    reported a fieldset-disabled input as enabled.
 * 3. **ARIA.** The element, or the nearest ancestor that declares
 *    `aria-disabled` at all, declares `aria-disabled="true"`. Walking up matches
 *    how a disabled composite (toolbar, menu, listbox) disables its items; an
 *    inner `aria-disabled="false"` short-circuits the walk and re-enables.
 *
 * This mirrors Playwright's own `getAriaDisabled` (native + disabled-fieldset
 * ancestry + inherited explicit `aria-disabled`) with one deliberate
 * simplification: Playwright gates the ARIA branch on the element's computed
 * ARIA role, which needs a full role engine and is outside this library's
 * CSS/DOM boundary (ADR-008). An explicit `aria-disabled="true"` is therefore
 * taken at face value, consistent with how {@link isElementRequired},
 * {@link isElementReadonly} and {@link isElementInError} already read their ARIA
 * attributes.
 *
 * @param element - The element whose disabled state is being decided.
 */
export function isElementDisabled(element: Element): boolean {
  const formControlTags = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'OPTION', 'OPTGROUP', 'FIELDSET'];
  if (formControlTags.includes(element.tagName)) {
    if (element.hasAttribute('disabled')) {
      return true;
    }
    if (element.tagName === 'OPTION' && element.closest('optgroup[disabled]') !== null) {
      return true;
    }
    const disabledFieldset = element.closest('fieldset[disabled]');
    if (disabledFieldset !== null) {
      const legend = disabledFieldset.querySelector(':scope > legend');
      if (legend === null || !legend.contains(element)) {
        return true;
      }
    }
  }

  let current: Element | null = element;
  while (current !== null) {
    const ariaDisabled = current.getAttribute('aria-disabled');
    if (ariaDisabled === 'true') {
      return true;
    }
    if (ariaDisabled === 'false') {
      return false;
    }
    current = current.parentElement;
  }
  return false;
}

/**
 * Whether the element is marked read-only, via the native `readonly` attribute
 * or `aria-readonly="true"`.
 *
 * The native attribute exists only on native form controls, whereas composite
 * widgets (comboboxes, grids, `contenteditable` regions) express read-only state
 * through ARIA — so both signals are consulted (#1053).
 *
 * @param element - The element whose read-only state is being decided.
 */
export function isElementReadonly(element: Element): boolean {
  if (element.hasAttribute('readonly')) {
    return true;
  }
  return element.getAttribute('aria-readonly') === 'true';
}

/**
 * Whether the element is marked required, via the native `required` property or
 * `aria-required="true"`.
 *
 * The native **property** (not the attribute) is read, so a `required` attribute
 * on an element that has no such concept (`<div required>`) is inert — matching
 * how {@link isElementDisabled} treats a stray `disabled`. Reading the attribute
 * instead was `PlaywrightInteractor`'s pre-existing divergence from jsdom on
 * exactly that markup.
 *
 * @param element - The element whose required state is being decided.
 */
export function isElementRequired(element: Element): boolean {
  if ((element as { required?: unknown }).required === true) {
    return true;
  }
  return element.getAttribute('aria-required') === 'true';
}

/**
 * Whether the element is in an invalid/error state, signalled by
 * `aria-invalid="true"` — the cross-widget convention. Native constraint
 * validity (`:invalid`, `validity.valid`) is deliberately NOT consulted: it
 * reports a state the user has not necessarily been shown, whereas
 * `aria-invalid` is what a component sets when it renders the error.
 *
 * @param element - The element whose error state is being decided.
 */
export function isElementInError(element: Element): boolean {
  return element.getAttribute('aria-invalid') === 'true';
}
