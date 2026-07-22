import { Separator } from 'reka-ui';
import { defineComponent, h } from 'vue';

/**
 * Separator scene: a semantic horizontal separator (the ARIA default), a
 * semantic vertical separator, and a decorative one (`role="none"`).
 */
export const SeparatorExample = defineComponent({
  name: 'SeparatorExample',
  setup() {
    return () =>
      h('div', [
        h(Separator, { 'data-testid': 'horizontal-separator' }),
        h(Separator, { 'data-testid': 'vertical-separator', orientation: 'vertical' }),
        h(Separator, { 'data-testid': 'decorative-separator', decorative: true }),
      ]);
  },
});
