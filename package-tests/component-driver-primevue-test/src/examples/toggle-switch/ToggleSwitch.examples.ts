import ToggleSwitch from 'primevue/toggleswitch';
import { defineComponent, h, ref } from 'vue';

/** ToggleSwitch scene: a live switch plus a disabled (checked) instance. */
export const ToggleSwitchExample = defineComponent({
  name: 'ToggleSwitchExample',
  setup() {
    const airplaneMode = ref(false);
    return () =>
      h('div', [
        h(ToggleSwitch, {
          'data-testid': 'airplane-mode',
          modelValue: airplaneMode.value,
          'onUpdate:modelValue': (value: boolean) => {
            airplaneMode.value = value;
          },
        }),
        h(ToggleSwitch, {
          'data-testid': 'locked-switch',
          disabled: true,
          modelValue: true,
        }),
      ]);
  },
});
