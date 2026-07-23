import { PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui';
import { defineComponent, h } from 'vue';

/**
 * Popover scene: TWO independent popover instances. `PopoverContent` shares
 * `role="dialog"` with a modal `Dialog.Content` (see `PopoverDriver`'s DOM
 * audit), so a single-instance scene could not prove the driver's
 * `aria-controls`-derived content locator actually disambiguates one popover
 * from another (or from a simultaneously-open sibling) rather than matching
 * whichever `role="dialog"` happens to be open first.
 */
export const PopoverExample = defineComponent({
  name: 'PopoverExample',
  setup() {
    return () =>
      h('div', [
        h(PopoverRoot, {}, () => [
          h(PopoverTrigger, { 'data-testid': 'first-trigger' }, () => 'Open first popover'),
          h(PopoverPortal, {}, () => [
            h(PopoverContent, { 'data-testid': 'first-content' }, () => [
              h('p', 'First popover body'),
              h(PopoverClose, { 'data-testid': 'first-close' }, () => 'Close'),
            ]),
          ]),
        ]),
        h(PopoverRoot, {}, () => [
          h(PopoverTrigger, { 'data-testid': 'second-trigger' }, () => 'Open second popover'),
          h(PopoverPortal, {}, () => [
            h(PopoverContent, { 'data-testid': 'second-content' }, () => [
              h('p', 'Second popover body'),
              h(PopoverClose, { 'data-testid': 'second-close' }, () => 'Close'),
            ]),
          ]),
        ]),
      ]);
  },
});
