import ContextMenu from 'primevue/contextmenu';
import { defineComponent, h, ref } from 'vue';

/**
 * ContextMenu scene: right-clicking the target area opens the teleported
 * popup; item commands write to an in-page span so activation is observable.
 * The model mixes items with a separator (same `<li>` tag as items — the
 * reason item iteration uses `childListHelper`) and a disabled item. A second,
 * independent target/menu pair proves the single-open-menu scoping the driver
 * documents (PrimeVue unmounts a closed `ContextMenu`, so at most one
 * `[data-pc-name="contextmenu"]` surface exists at a time).
 */
export const ContextMenuExample = defineComponent({
  name: 'ContextMenuExample',
  setup() {
    const menu = ref();
    const secondMenu = ref();
    const lastAction = ref('');
    const items = [
      {
        label: 'Copy',
        command: () => {
          lastAction.value = 'copy';
        },
      },
      {
        label: 'Paste',
        command: () => {
          lastAction.value = 'paste';
        },
      },
      { separator: true },
      { label: 'Delete', disabled: true },
    ];
    const secondItems = [{ label: 'Rename' }, { label: 'Duplicate' }];
    return () =>
      h('div', [
        h(
          'div',
          {
            'data-testid': 'context-target',
            onContextmenu: (event: MouseEvent) => menu.value?.show(event),
          },
          'Right-click here'
        ),
        h('span', { 'data-testid': 'last-action' }, lastAction.value),
        h(ContextMenu, {
          ref: menu,
          'data-testid': 'context-menu',
          model: items,
        }),
        h(
          'div',
          {
            'data-testid': 'second-context-target',
            onContextmenu: (event: MouseEvent) => secondMenu.value?.show(event),
          },
          'Right-click here too'
        ),
        h(ContextMenu, {
          ref: secondMenu,
          'data-testid': 'second-context-menu',
          model: secondItems,
        }),
      ]);
  },
});
