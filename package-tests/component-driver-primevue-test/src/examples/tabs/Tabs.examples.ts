import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';
import { defineComponent, h } from 'vue';

/**
 * Tabs scene (v4 Tabs/TabList/Tab/TabPanels/TabPanel): three tabs with the
 * third disabled, and one panel per tab.
 */
export const TabsExample = defineComponent({
  name: 'TabsExample',
  setup() {
    return () =>
      h(
        Tabs,
        { value: '0', 'data-testid': 'demo-tabs' },
        {
          default: () => [
            h(
              TabList,
              {},
              {
                default: () => [
                  h(Tab, { value: '0' }, { default: () => 'One' }),
                  h(Tab, { value: '1' }, { default: () => 'Two' }),
                  h(Tab, { value: '2', disabled: true }, { default: () => 'Three' }),
                ],
              }
            ),
            h(
              TabPanels,
              {},
              {
                default: () => [
                  h(TabPanel, { value: '0' }, { default: () => 'First panel' }),
                  h(TabPanel, { value: '1' }, { default: () => 'Second panel' }),
                  h(TabPanel, { value: '2' }, { default: () => 'Third panel' }),
                ],
              }
            ),
          ],
        }
      );
  },
});
