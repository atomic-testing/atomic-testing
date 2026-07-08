/**
 * Environment-agnostic visibility policy shared by `DOMInteractor` and
 * `PlaywrightInteractor` so the two cannot drift (#1053). It is the single source
 * of truth for what "visible" means; each interactor supplies only the primitive
 * to read computed style, mirroring the `interactorUtil.interactorWaitUtil`
 * parameterized-by-primitive house pattern.
 *
 * WHY the three properties are treated differently:
 *
 * - `visibility` is an INHERITED property, so an element's own computed
 *   `visibility` already reflects an ancestor's `visibility: hidden` — while a
 *   descendant that overrides back to `visibility: visible` still reads as
 *   `visible`. Checking the element alone is therefore both sufficient and
 *   correct; walking ancestors would wrongly hide a deliberately re-shown
 *   descendant.
 * - `display: none` and `opacity: 0` are NOT inherited: an ancestor with either
 *   removes the whole subtree from view WITHOUT changing a descendant's own
 *   computed value. Inspecting only the target element (the pre-#1053 bug) let a
 *   child of a hidden ancestor report `true`. So these must be walked up the
 *   ancestor chain — element included — to (and including) the document root.
 *
 * The function is passed BY VALUE into Playwright's `page.evaluate`, which
 * serializes it to the browser. It must therefore stay self-contained: it may
 * reference only its parameters and DOM globals (`getComputedStyle`), never an
 * import, a module-scope helper, or a Node object. Keep it synchronous and
 * free of constructs that transpile to injected runtime helpers.
 *
 * @param element - The element whose visibility is being decided.
 * @param getStyle - Accessor returning an element's computed style. Defaults to
 *   the ambient `getComputedStyle` so the serialized function resolves the DOM
 *   global inside the browser; the DOM leg passes jsdom's `window.getComputedStyle`
 *   explicitly.
 * @returns `true` only when the element itself is not `visibility: hidden` and
 *   the element and every ancestor are displayed (`display !== 'none'`) and
 *   non-transparent (`opacity !== '0'`).
 */
export function isElementVisibleByStyle(
  element: Element,
  getStyle: (el: Element) => CSSStyleDeclaration = el => getComputedStyle(el)
): boolean {
  if (getStyle(element).visibility === 'hidden') {
    return false;
  }
  let current: Element | null = element;
  while (current !== null) {
    const style = getStyle(current);
    if (style.display === 'none' || style.opacity === '0') {
      return false;
    }
    current = current.parentElement;
  }
  return true;
}
