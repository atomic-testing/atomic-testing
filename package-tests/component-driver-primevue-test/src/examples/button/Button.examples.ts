import Button from 'primevue/button';
import { defineComponent, h, ref } from 'vue';

/**
 * Seed scene proving the Vue + PrimeVue harness end-to-end (#1020): a stateful
 * counter button (click round-trip through Vue reactivity) and a disabled
 * button (attribute read).
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
      ]);
  },
});
