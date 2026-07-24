import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui';
import { CSSProperties, defineComponent, h, ref } from 'vue';

const rootStyle: CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '200px',
  height: '20px',
  userSelect: 'none',
  touchAction: 'none',
};
const trackStyle: CSSProperties = { position: 'relative', flexGrow: 1, height: '4px', backgroundColor: '#ddd' };
const rangeStyle: CSSProperties = { position: 'absolute', height: '100%', backgroundColor: '#333' };
const thumbStyle: CSSProperties = {
  display: 'block',
  width: '16px',
  height: '16px',
  borderRadius: '8px',
  backgroundColor: '#333',
};

/**
 * Slider scene: a live single-thumb slider (0–100, step 1, keyboard-drivable)
 * plus a disabled instance. Inline sizing only — Reka is unstyled, and a
 * zero-size track/thumb would make the pointer-based `dragBy` untestable in a
 * browser (mirrors `component-driver-radix-test`'s Slider scene). Reka's
 * `SliderThumb` needs `ResizeObserver` on mount (via vueuse's `useSize`) — see
 * this package's `jest.setup.ts` for the jsdom polyfill.
 */
export const SliderExample = defineComponent({
  name: 'SliderExample',
  setup() {
    const volume = ref([30]);
    return () =>
      h('div', [
        h(
          SliderRoot,
          {
            'data-testid': 'volume-slider',
            min: 0,
            max: 100,
            step: 1,
            modelValue: volume.value,
            style: rootStyle,
            // reka-ui declares its emits as a plain string array, so Vue infers
            // the handler's payload as `unknown` rather than the prop's own type.
            'onUpdate:modelValue': (value: unknown) => {
              volume.value = value as number[];
            },
          },
          {
            default: () =>
              h(SliderTrack, { style: trackStyle }, () => [
                h(SliderRange, { style: rangeStyle }),
                h(SliderThumb, { 'aria-label': 'Volume', style: thumbStyle }),
              ]),
          }
        ),
        h(
          SliderRoot,
          {
            'data-testid': 'frozen-slider',
            disabled: true,
            min: 0,
            max: 100,
            step: 1,
            modelValue: [40],
            style: rootStyle,
          },
          {
            default: () =>
              h(SliderTrack, { style: trackStyle }, () => [
                h(SliderRange, { style: rangeStyle }),
                h(SliderThumb, { 'aria-label': 'Volume', style: thumbStyle }),
              ]),
          }
        ),
      ]);
  },
});
