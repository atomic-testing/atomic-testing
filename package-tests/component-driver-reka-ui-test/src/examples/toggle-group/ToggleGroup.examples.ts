import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui';
import { defineComponent, h, ref } from 'vue';

/**
 * ToggleGroup scene: a `type="single"` group (default selection `'left'`,
 * one item disabled) and a `type="multiple"` group (default selection
 * `['bold']`) — both render the same `data-state="on"/"off"` per-item shape
 * `ToggleGroupDriver` reads, so this proves the driver is
 * selection-mode-agnostic.
 */
export const ToggleGroupExample = defineComponent({
  name: 'ToggleGroupExample',
  setup() {
    const alignment = ref('left');
    const formatting = ref(['bold']);
    return () =>
      h('div', [
        h(
          ToggleGroupRoot,
          {
            type: 'single',
            'aria-label': 'Alignment',
            'data-testid': 'toggle-group-single',
            modelValue: alignment.value,
            // reka-ui declares its emits as a plain string array, so Vue infers
            // the handler's payload as `unknown` rather than the prop's own type.
            'onUpdate:modelValue': (value: unknown) => {
              alignment.value = value as string;
            },
          },
          () => [
            h(ToggleGroupItem, { value: 'left' }, () => 'Left'),
            h(ToggleGroupItem, { value: 'center' }, () => 'Center'),
            h(ToggleGroupItem, { value: 'right', disabled: true }, () => 'Right'),
          ]
        ),
        h(
          ToggleGroupRoot,
          {
            type: 'multiple',
            'aria-label': 'Formatting',
            'data-testid': 'toggle-group-multiple',
            modelValue: formatting.value,
            'onUpdate:modelValue': (value: unknown) => {
              formatting.value = value as string[];
            },
          },
          () => [
            h(ToggleGroupItem, { value: 'bold' }, () => 'Bold'),
            h(ToggleGroupItem, { value: 'italic' }, () => 'Italic'),
          ]
        ),
      ]);
  },
});
