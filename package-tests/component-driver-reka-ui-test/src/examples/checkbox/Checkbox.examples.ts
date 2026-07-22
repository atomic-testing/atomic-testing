import { CheckboxRoot } from 'reka-ui';
import { defineComponent, h, ref } from 'vue';

/**
 * Checkbox scene: a live checkbox (unchecked by default), a disabled
 * instance, and an indeterminate instance (`modelValue: 'indeterminate'`).
 */
export const CheckboxExample = defineComponent({
  name: 'CheckboxExample',
  setup() {
    const agreed = ref<boolean | 'indeterminate'>(false);
    const partial = ref<boolean | 'indeterminate'>('indeterminate');
    return () =>
      h('div', [
        h(CheckboxRoot, {
          'data-testid': 'terms-checkbox',
          modelValue: agreed.value,
          // reka-ui declares its emits as a plain string array, so Vue infers
          // the handler's payload as `unknown` rather than the prop's own type.
          'onUpdate:modelValue': (value: unknown) => {
            agreed.value = value as boolean | 'indeterminate';
          },
        }),
        h(CheckboxRoot, {
          'data-testid': 'locked-checkbox',
          disabled: true,
        }),
        h(CheckboxRoot, {
          'data-testid': 'indeterminate-checkbox',
          modelValue: partial.value,
          'onUpdate:modelValue': (value: unknown) => {
            partial.value = value as boolean | 'indeterminate';
          },
        }),
      ]);
  },
});
