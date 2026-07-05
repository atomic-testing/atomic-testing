import InputText from 'primevue/inputtext';
import { defineComponent, h, ref } from 'vue';

/**
 * InputText scene: two live inputs (two-instance disambiguation), plus
 * dedicated disabled / readonly / required+invalid instances for the
 * state-read surface.
 */
export const InputTextExample = defineComponent({
  name: 'InputTextExample',
  setup() {
    const firstName = ref('');
    const lastName = ref('Smith');
    return () =>
      h('div', [
        h(InputText, {
          'data-testid': 'first-name',
          modelValue: firstName.value,
          'onUpdate:modelValue': (value: string | undefined) => {
            firstName.value = value ?? '';
          },
        }),
        h(InputText, {
          'data-testid': 'last-name',
          modelValue: lastName.value,
          'onUpdate:modelValue': (value: string | undefined) => {
            lastName.value = value ?? '';
          },
        }),
        h(InputText, {
          'data-testid': 'disabled-input',
          disabled: true,
          modelValue: 'off limits',
        }),
        h(InputText, {
          'data-testid': 'readonly-input',
          readonly: true,
          modelValue: 'look only',
        }),
        h(InputText, {
          'data-testid': 'strict-input',
          invalid: true,
          required: true,
          modelValue: '',
        }),
      ]);
  },
});
