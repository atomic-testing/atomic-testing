import { TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui';
import { defineComponent, h } from 'vue';

/**
 * Tooltip scene: a `TooltipProvider` at `delayDuration={0}` (deterministic
 * jsdom hover probes — see `TooltipDriver`'s class doc) wrapping a single
 * `TooltipRoot`/`TooltipTrigger`/`TooltipContent` group. The trigger carries
 * the `data-testid`; the driver locates the portalled content through the
 * trigger's `aria-describedby` link, not through a testid of its own.
 */
export const TooltipExample = defineComponent({
  name: 'TooltipExample',
  setup() {
    return () =>
      h(TooltipProvider, { delayDuration: 0 }, () => [
        h(TooltipRoot, {}, () => [
          h(TooltipTrigger, { 'data-testid': 'info-trigger' }, () => 'Hover me'),
          h(TooltipPortal, {}, () => [h(TooltipContent, {}, () => 'Saved automatically every 30 seconds')]),
        ]),
      ]);
  },
});
