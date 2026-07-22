import Select from 'primevue/select';
import { defineComponent, h, ref } from 'vue';

const cities = [
  { name: 'Berlin', code: 'BER' },
  { name: 'London', code: 'LDN' },
  { name: 'Tokyo', code: 'TYO' },
];

const sizes = [{ name: 'Small' }, { name: 'Large' }];

/**
 * Select scene: a placeholder city select (label-based selection round-trip),
 * a second select (two-instance disambiguation — its own overlay must never
 * collide with the city select's, which the aria-controls-linked dropdown
 * locator guarantees), a disabled select, and a select rendered with
 * `appendTo="self"` (#1033 — the listbox stays in-tree instead of teleporting
 * to `document.body`; `SelectDriver` needs no option for this, see its class
 * doc's "Anchoring" note).
 */
export const SelectExample = defineComponent({
  name: 'SelectExample',
  setup() {
    const city = ref<string | null>(null);
    const size = ref<string | null>('Small');
    const selfAnchored = ref<string | null>(null);
    return () =>
      h('div', [
        h(Select, {
          'data-testid': 'city-select',
          options: cities,
          optionLabel: 'name',
          optionValue: 'code',
          placeholder: 'Pick a city',
          modelValue: city.value,
          'onUpdate:modelValue': (value: string | null) => {
            city.value = value;
          },
        }),
        h(Select, {
          'data-testid': 'size-select',
          options: sizes,
          optionLabel: 'name',
          optionValue: 'name',
          modelValue: size.value,
          'onUpdate:modelValue': (value: string | null) => {
            size.value = value;
          },
        }),
        h(Select, {
          'data-testid': 'locked-select',
          options: cities,
          optionLabel: 'name',
          disabled: true,
          placeholder: 'Locked',
        }),
        h(Select, {
          'data-testid': 'self-anchored-select',
          appendTo: 'self',
          options: sizes,
          optionLabel: 'name',
          optionValue: 'name',
          placeholder: 'Pick a size',
          modelValue: selfAnchored.value,
          'onUpdate:modelValue': (value: string | null) => {
            selfAnchored.value = value;
          },
        }),
      ]);
  },
});
