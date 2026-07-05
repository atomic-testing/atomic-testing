import Slider from 'primevue/slider';
import { defineComponent, h, ref } from 'vue';

/**
 * Slider scene: a live slider (0–100, step 5, keyboard-drivable) plus a
 * disabled instance. The live value is mirrored into a text span so e2e can
 * verify the model actually moved, not just the aria mirror.
 */
export const SliderExample = defineComponent({
  name: 'SliderExample',
  setup() {
    const volume = ref(30);
    return () =>
      h('div', [
        h(Slider, {
          'data-testid': 'volume',
          min: 0,
          max: 100,
          step: 5,
          style: 'width: 14rem',
          modelValue: volume.value,
          'onUpdate:modelValue': (value: number | number[]) => {
            volume.value = value as number;
          },
        }),
        h('span', { 'data-testid': 'volume-readout' }, String(volume.value)),
        h(Slider, {
          'data-testid': 'frozen-slider',
          disabled: true,
          modelValue: 40,
          style: 'width: 14rem',
        }),
      ]);
  },
});
