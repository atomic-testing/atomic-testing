import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui';
import { defineComponent, h } from 'vue';

/**
 * DropdownMenu scene: a trigger and a menu with three items (Profile, a
 * disabled Billing, and Log out) separated by a `Separator` between Billing
 * and Log out. Mirrors `component-driver-radix-v1`'s dropdown-menu example
 * scene so the same suite structure translates directly.
 */
export const DropdownMenuExample = defineComponent({
  name: 'DropdownMenuExample',
  setup() {
    return () =>
      h(DropdownMenuRoot, null, {
        default: () => [
          h(DropdownMenuTrigger, { 'data-testid': 'dropdown-menu-trigger' }, () => 'Options'),
          h(DropdownMenuPortal, null, {
            default: () => [
              h(DropdownMenuContent, { 'data-testid': 'dropdown-menu-content' }, () => [
                h(DropdownMenuItem, { 'data-testid': 'dropdown-menu-item-profile' }, () => 'Profile'),
                h(DropdownMenuItem, { disabled: true, 'data-testid': 'dropdown-menu-item-billing' }, () => 'Billing'),
                h(DropdownMenuSeparator, { 'data-testid': 'dropdown-menu-separator' }),
                h(DropdownMenuItem, { 'data-testid': 'dropdown-menu-item-logout' }, () => 'Log out'),
              ]),
            ],
          }),
        ],
      });
  },
});
