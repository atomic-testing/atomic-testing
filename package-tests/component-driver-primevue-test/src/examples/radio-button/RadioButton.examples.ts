import RadioButton from 'primevue/radiobutton';
import { defineComponent, h, ref } from 'vue';

/**
 * RadioButton scene: three radios sharing one model/`name`, each nested inside
 * a per-option wrapper div (the layout consumers really use, and the reason
 * the group driver's item walk recurses into wrappers). `beer` is disabled.
 */
export const RadioButtonExample = defineComponent({
  name: 'RadioButtonExample',
  setup() {
    const drink = ref('water');
    const option = (value: string, disabled = false) =>
      h('div', { style: 'display:flex;gap:0.5rem;align-items:center' }, [
        h(RadioButton, {
          'data-testid': `drink-${value}`,
          name: 'drink',
          value,
          disabled,
          modelValue: drink.value,
          'onUpdate:modelValue': (selected: string) => {
            drink.value = selected;
          },
        }),
        h('span', value),
      ]);
    return () => h('div', { 'data-testid': 'drink-group' }, [option('water'), option('beer', true), option('wine')]);
  },
});
