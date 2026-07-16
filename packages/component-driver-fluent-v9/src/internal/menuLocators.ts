import { byLinkedElement, PartLocator } from '@atomic-testing/core';

/**
 * The portalled `MenuList` (`role="menu"`, class `fui-MenuList`) linked from a
 * `MenuTrigger`'s child element, followed at call time via `byLinkedElement`
 * rather than a static role/class re-root.
 *
 * DOM audit (@fluentui/react-components@9.74.3): `MenuTrigger` clones
 * `aria-haspopup="menu"`, `aria-expanded`, and a stable `id` onto its child
 * (a plain `Button`, `MenuButton`, or a `SplitButton` half) REGARDLESS of open
 * state, while the portalled `MenuList` carries `aria-labelledby` pointing back
 * at that same `id` — but ONLY while mounted (Fluent unmounts the popover on
 * close). A static `byRole('menu', 'Root')` re-root (the MUI/`DropdownMenu`
 * recipe) cannot tell two simultaneously open menus apart — both render the
 * identical role — so this driver instead resolves the CONCRETE trigger `id`
 * fresh on every call and matches the menu whose `aria-labelledby` equals it.
 *
 * Unlike Radix's `aria-controls` link (present only while open, so
 * `byLinkedElement` throws when closed — see `component-driver-radix-v1`'s
 * `PopoverDriver`), the attribute EXTRACTED here (the trigger's `id`) is always
 * present, so the resulting selector is always well-formed; it simply matches
 * nothing while the menu is closed (a normal not-found read, no throw).
 */
export function menuListLocator(triggerLocator: PartLocator): PartLocator {
  return byLinkedElement('Root')
    .onLinkedElement(triggerLocator)
    .extractAttribute('id')
    .toMatchMyAttribute('aria-labelledby');
}
