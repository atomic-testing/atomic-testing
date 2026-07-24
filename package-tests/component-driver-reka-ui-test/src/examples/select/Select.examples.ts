import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui';
import { defineComponent, h, ref } from 'vue';

/**
 * Select scene: a live select (default value `'apple'`) with three items, one
 * of them (`'cherry'`) disabled, plus a second, disabled-and-required select
 * (no options needed — only its trigger's `isDisabled`/`isRequired` are
 * exercised) — the fixed scene `SelectDriver.dom.test.ts`/`.e2e.test.ts`
 * exercise against.
 */
export const SelectExample = defineComponent({
  name: 'SelectExample',
  setup() {
    const fruit = ref('apple');
    return () =>
      h('div', [
        h(
          SelectRoot,
          {
            modelValue: fruit.value,
            'onUpdate:modelValue': (value: unknown) => (fruit.value = value as string),
          },
          () => [
            h(SelectTrigger, { 'data-testid': 'select-trigger' }, () => [h(SelectValue, {}), h(SelectIcon, {})]),
            h(SelectPortal, {}, () => [
              h(SelectContent, { 'data-testid': 'select-content' }, () => [
                h(SelectViewport, {}, () => [
                  h(SelectItem, { value: 'apple', 'data-testid': 'select-item-apple' }, () => [
                    h(SelectItemText, {}, () => 'Apple'),
                  ]),
                  h(SelectItem, { value: 'banana', 'data-testid': 'select-item-banana' }, () => [
                    h(SelectItemText, {}, () => 'Banana'),
                  ]),
                  h(SelectItem, { value: 'cherry', disabled: true, 'data-testid': 'select-item-cherry' }, () => [
                    h(SelectItemText, {}, () => 'Cherry'),
                  ]),
                ]),
              ]),
            ]),
          ]
        ),
        h(SelectRoot, { defaultValue: 'apple', disabled: true, required: true }, () => [
          h(SelectTrigger, { 'data-testid': 'locked-select-trigger' }, () => [h(SelectValue, {}), h(SelectIcon, {})]),
        ]),
      ]);
  },
});
