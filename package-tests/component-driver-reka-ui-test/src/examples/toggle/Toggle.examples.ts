import { Toggle } from 'reka-ui';
import { defineComponent, h, ref } from 'vue';

/** Toggle scene: a live pressable toggle plus a disabled instance. */
export const ToggleExample = defineComponent({
  name: 'ToggleExample',
  setup() {
    const bold = ref(false);
    return () =>
      h('div', [
        h(Toggle, {
          'data-testid': 'bold-toggle',
          modelValue: bold.value,
          'onUpdate:modelValue': (value: boolean) => {
            bold.value = value;
          },
        }),
        h(Toggle, {
          'data-testid': 'locked-toggle',
          disabled: true,
        }),
      ]);
  },
});
