import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui';
import { defineComponent, h, ref } from 'vue';

/**
 * Tabs scene: three tabs (One, Two, Three) each with distinct panel text, the
 * third tab disabled. `TabsRoot` carries the scene's own `data-testid` (this
 * package's addressing convention — see `CheckboxExample`); `TabsDriver`'s
 * default `itemLocator` (`byRole('tab')`) finds the triggers relative to it
 * regardless of the `TabsList` wrapper in between.
 */
export const TabsExample = defineComponent({
  name: 'TabsExample',
  setup() {
    const activeTab = ref('one');
    return () =>
      h(
        TabsRoot,
        {
          'data-testid': 'tabs',
          modelValue: activeTab.value,
          // reka-ui declares its emits as a plain string array, so Vue infers
          // the handler's payload as `unknown` rather than the prop's own type.
          'onUpdate:modelValue': (value: unknown) => {
            activeTab.value = value as string;
          },
        },
        () => [
          h(TabsList, { 'aria-label': 'Example tabs' }, () => [
            h(TabsTrigger, { value: 'one' }, () => 'One'),
            h(TabsTrigger, { value: 'two' }, () => 'Two'),
            h(TabsTrigger, { value: 'three', disabled: true }, () => 'Three'),
          ]),
          h(TabsContent, { value: 'one' }, () => 'First panel'),
          h(TabsContent, { value: 'two' }, () => 'Second panel'),
          h(TabsContent, { value: 'three' }, () => 'Third panel'),
        ]
      );
  },
});
