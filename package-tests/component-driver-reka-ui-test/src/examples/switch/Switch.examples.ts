import { SwitchRoot } from 'reka-ui';
import { defineComponent, h, ref } from 'vue';

/**
 * Switch scene: a live switch (unchecked by default), mirrored into a text
 * span so e2e can verify the model actually moved, plus a disabled instance
 * and a labelled instance (native `<label for>` link).
 */
export const SwitchExample = defineComponent({
  name: 'SwitchExample',
  setup() {
    const enabled = ref(false);
    return () =>
      h('div', [
        h(SwitchRoot, {
          'data-testid': 'notifications-switch',
          modelValue: enabled.value,
          // reka-ui declares its emits as a plain string array, so Vue infers
          // the handler's payload as `unknown` rather than the prop's own type.
          'onUpdate:modelValue': (value: unknown) => {
            enabled.value = value as boolean;
          },
        }),
        h('span', { 'data-testid': 'switch-readout' }, String(enabled.value)),
        h(SwitchRoot, {
          'data-testid': 'locked-switch',
          disabled: true,
        }),
        h('label', { for: 'labelled-switch-id' }, 'Airplane mode'),
        h(SwitchRoot, {
          'data-testid': 'labelled-switch',
          id: 'labelled-switch-id',
        }),
      ]);
  },
});
