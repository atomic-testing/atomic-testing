import { byLinkedElement, PartLocator } from '@atomic-testing/core';

/**
 * The portalled options `TagPickerList` (`role="listbox"`, class
 * `fui-TagPickerList`) linked from the freeform `TagPickerInput`'s
 * `aria-controls`, followed at call time via `byLinkedElement` — the same
 * technique `dropdownLocators.ts` documents for `Dropdown`.
 *
 * DOM audit (@fluentui/react-components@9.74.3): `TagPickerInput` renders a
 * REAL `<input role="combobox">` (the same underlying `@fluentui/react-combobox`
 * trigger primitive `Dropdown`/`Combobox` use) with no `id` of its own; the
 * only DOM link to the portalled list is `aria-controls`, set to the list's
 * `id` ONLY while open — absent entirely (not merely empty) both before the
 * first open and again after closing, even though the list itself stays
 * mounted post-close for as long as the input retains focus (see
 * `TagPickerDriver`'s class doc for the same stale-mount quirk `Dropdown`
 * documents). `byLinkedElement` throws when the attribute it must extract
 * (`aria-controls`) is itself absent, so every caller of this locator guards
 * with try/catch — the same idiom `dropdownListboxLocator`/`tooltipContentLocator`
 * document for their own open-state-only links.
 */
export function tagPickerListLocator(inputLocator: PartLocator): PartLocator {
  return byLinkedElement('Root')
    .onLinkedElement(inputLocator)
    .extractAttribute('aria-controls')
    .toMatchMyAttribute('id');
}
