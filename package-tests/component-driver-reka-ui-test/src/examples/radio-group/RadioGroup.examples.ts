import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui';
import { defineComponent, h, ref } from 'vue';

/**
 * RadioGroup scene: two independent live groups — so cross-group bleed shows
 * up, since each group's own selection must not affect the other — with a
 * disabled item inside the first group, plus a group-level-disabled instance
 * and a group-level-required instance.
 */
export const RadioGroupExample = defineComponent({
  name: 'RadioGroupExample',
  setup() {
    const groupOneValue = ref<string | undefined>('a');
    const groupTwoValue = ref<string | undefined>(undefined);
    return () =>
      h('div', [
        h(
          RadioGroupRoot,
          {
            'data-testid': 'radio-group-one',
            modelValue: groupOneValue.value,
            // reka-ui declares its emits as a plain string array, so Vue infers
            // the handler's payload as `unknown` rather than the prop's own type.
            'onUpdate:modelValue': (value: unknown) => {
              groupOneValue.value = value as string;
            },
          },
          () => [
            h(RadioGroupItem, { value: 'a', 'data-testid': 'group-one-a' }, () => [h(RadioGroupIndicator)]),
            h(RadioGroupItem, { value: 'b', 'data-testid': 'group-one-b' }, () => [h(RadioGroupIndicator)]),
            h(RadioGroupItem, { value: 'c', disabled: true, 'data-testid': 'group-one-c' }, () => [
              h(RadioGroupIndicator),
            ]),
          ]
        ),
        h(
          RadioGroupRoot,
          {
            'data-testid': 'radio-group-two',
            modelValue: groupTwoValue.value,
            'onUpdate:modelValue': (value: unknown) => {
              groupTwoValue.value = value as string;
            },
          },
          () => [
            h(RadioGroupItem, { value: 'x', 'data-testid': 'group-two-x' }, () => [h(RadioGroupIndicator)]),
            h(RadioGroupItem, { value: 'y', 'data-testid': 'group-two-y' }, () => [h(RadioGroupIndicator)]),
          ]
        ),
        h(RadioGroupRoot, { 'data-testid': 'radio-group-locked', disabled: true }, () => [
          h(RadioGroupItem, { value: 'z', 'data-testid': 'group-locked-z' }, () => [h(RadioGroupIndicator)]),
        ]),
        h(RadioGroupRoot, { 'data-testid': 'radio-group-required', required: true }, () => [
          h(RadioGroupItem, { value: 'w', 'data-testid': 'group-required-w' }, () => [h(RadioGroupIndicator)]),
        ]),
      ]);
  },
});
