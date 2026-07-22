import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { defineComponent, h, ref } from 'vue';

/**
 * Menu (popup mode) scene: a toggle button opens the teleported popup; item
 * commands write to an in-page span so activation is observable. The model
 * mixes items with a separator (same `<li>` tag as items — the reason the
 * driver iterates via childListHelper) and a disabled item. A second popup
 * renders with `appendTo="self"` (#1033) to prove the in-tree anchoring path.
 */
export const MenuExample = defineComponent({
  name: 'MenuExample',
  setup() {
    const menu = ref();
    const selfAnchoredMenu = ref();
    const lastAction = ref('');
    const items = [
      {
        label: 'New file',
        command: () => {
          lastAction.value = 'new-file';
        },
      },
      {
        label: 'Duplicate',
        command: () => {
          lastAction.value = 'duplicate';
        },
      },
      { separator: true },
      { label: 'Delete', disabled: true },
    ];
    const selfAnchoredItems = [{ label: 'Archive' }, { label: 'Restore' }];
    return () =>
      h('div', [
        h(Button, {
          'data-testid': 'menu-toggle',
          label: 'Actions',
          onClick: (event: Event) => {
            menu.value?.toggle(event);
          },
        }),
        h('span', { 'data-testid': 'last-action' }, lastAction.value),
        h(Menu, {
          ref: menu,
          'data-testid': 'actions-menu',
          popup: true,
          model: items,
        }),
        h(Button, {
          'data-testid': 'self-anchored-menu-toggle',
          label: 'More actions',
          onClick: (event: Event) => {
            selfAnchoredMenu.value?.toggle(event);
          },
        }),
        h(Menu, {
          ref: selfAnchoredMenu,
          'data-testid': 'self-anchored-menu',
          appendTo: 'self',
          popup: true,
          model: selfAnchoredItems,
        }),
      ]);
  },
});
