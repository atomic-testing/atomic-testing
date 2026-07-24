import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui';
import { defineComponent, h } from 'vue';

/**
 * Dialog scene: a trigger opens a portalled `DialogContent` (teleported to
 * `document.body`, per the portal recipe — see `DialogDriver`'s class doc)
 * carrying a `DialogTitle` + `DialogDescription` + a `DialogClose` button.
 */
export const DialogExample = defineComponent({
  name: 'DialogExample',
  setup() {
    return () =>
      h(DialogRoot, {}, () => [
        h(DialogTrigger, { 'data-testid': 'dialog-trigger' }, () => 'Open dialog'),
        h(DialogPortal, {}, () => [
          h(DialogOverlay, { 'data-testid': 'dialog-overlay' }),
          h(DialogContent, { 'data-testid': 'dialog-content' }, () => [
            h(DialogTitle, { 'data-testid': 'dialog-title' }, () => 'Audit dialog'),
            h(DialogDescription, { 'data-testid': 'dialog-description' }, () => 'Dialog description for the audit.'),
            h(DialogClose, { 'data-testid': 'dialog-close' }, () => 'Close'),
          ]),
        ]),
      ]);
  },
});
