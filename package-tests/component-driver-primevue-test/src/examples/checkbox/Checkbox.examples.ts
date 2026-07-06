import Checkbox from 'primevue/checkbox';
import { defineComponent, h, ref } from 'vue';

/**
 * Checkbox scene: a binary checkbox (boolean model, no `value` attribute), a
 * disabled and a required binary instance, plus an array-value pair sharing
 * one model — the two modes the v1 driver documents.
 */
export const CheckboxExample = defineComponent({
  name: 'CheckboxExample',
  setup() {
    const subscribed = ref(false);
    const toppings = ref<string[]>(['cheese']);
    return () =>
      h('div', [
        h(Checkbox, {
          'data-testid': 'subscribe',
          binary: true,
          modelValue: subscribed.value,
          'onUpdate:modelValue': (value: boolean) => {
            subscribed.value = value;
          },
        }),
        h(Checkbox, {
          'data-testid': 'disabled-checkbox',
          binary: true,
          disabled: true,
          modelValue: true,
        }),
        h(Checkbox, {
          'data-testid': 'required-checkbox',
          binary: true,
          required: true,
          modelValue: false,
        }),
        h(Checkbox, {
          'data-testid': 'topping-cheese',
          value: 'cheese',
          modelValue: toppings.value,
          'onUpdate:modelValue': (value: string[]) => {
            toppings.value = value;
          },
        }),
        h(Checkbox, {
          'data-testid': 'topping-mushroom',
          value: 'mushroom',
          modelValue: toppings.value,
          'onUpdate:modelValue': (value: string[]) => {
            toppings.value = value;
          },
        }),
      ]);
  },
});
