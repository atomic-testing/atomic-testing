import Button from 'primevue/button';
import { defineComponent, h, ref } from 'vue';

/**
 * Button scene: a stateful counter button (click round-trip through Vue
 * reactivity), a disabled button (attribute read), and a badge button — the
 * badge renders as a sibling span inside the button, so it distinguishes
 * `getLabel()` (label section only) from a whole-root `getText()`.
 */
export const ButtonExample = defineComponent({
  name: 'ButtonExample',
  setup() {
    const count = ref(0);
    return () =>
      h('div', [
        h(Button, {
          'data-testid': 'counter-button',
          label: `Count: ${count.value}`,
          onClick: () => {
            count.value += 1;
          },
        }),
        h(Button, {
          'data-testid': 'disabled-button',
          disabled: true,
          label: 'Disabled action',
        }),
        h(Button, {
          'data-testid': 'badge-button',
          badge: '3',
          label: 'Inbox',
        }),
      ]);
  },
});
