import { byLinkedElement, PartLocator } from '@atomic-testing/core';

/**
 * The portalled option listbox (`role="listbox"`, class `fui-Dropdown__listbox`)
 * linked from the TRIGGER's `aria-controls`, followed at call time via
 * `byLinkedElement`.
 *
 * DOM audit (@fluentui/react-components@9.74.3): unlike `MenuTrigger` (which
 * clones a stable `id` onto its child REGARDLESS of open state — see
 * `menuLocators.ts`), Dropdown's trigger `<button role="combobox">` carries no
 * `id` of its own at all; the only DOM link back to the listbox is
 * `aria-controls`, which Fluent sets to the listbox's `id` ONLY while `open`
 * is `true` — absent both before the first open and again after closing, even
 * though the listbox element itself stays mounted post-close for as long as
 * the trigger retains focus (see `DropdownDriver`'s class doc). `byLinkedElement`
 * throws when the attribute it must extract (`aria-controls`) is itself
 * absent — i.e. whenever the dropdown is closed — so every caller of this
 * locator must guard with try/catch, the same idiom `tooltipLocators.ts`
 * documents for its own open-state-only `aria-describedby` link.
 */
export function dropdownListboxLocator(triggerLocator: PartLocator): PartLocator {
  return byLinkedElement('Root')
    .onLinkedElement(triggerLocator)
    .extractAttribute('aria-controls')
    .toMatchMyAttribute('id');
}
