import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { defineComponent, h, ref } from 'vue';

/**
 * Dialog scene: a trigger button opens a modal Dialog whose body holds an
 * InputText and a Save button (the ContainerDriver content scene); Save writes
 * the entered name into an in-page span so tests can observe that content
 * interaction really flowed through the teleported dialog. A second, simpler
 * Dialog renders with `appendTo="self"` (#1033) to prove the in-tree anchoring
 * path — see `DialogDriver`'s class doc "Anchoring" section.
 */
export const DialogExample = defineComponent({
  name: 'DialogExample',
  setup() {
    const visible = ref(false);
    const draftName = ref('');
    const savedName = ref('');
    const selfAnchoredVisible = ref(false);
    return () =>
      h('div', [
        h(Button, {
          'data-testid': 'open-dialog',
          label: 'Edit profile',
          onClick: () => {
            visible.value = true;
          },
        }),
        h('span', { 'data-testid': 'saved-name' }, savedName.value),
        h(
          Dialog,
          {
            'data-testid': 'profile-dialog',
            header: 'Edit Profile',
            modal: true,
            visible: visible.value,
            'onUpdate:visible': (value: boolean) => {
              visible.value = value;
            },
          },
          {
            default: () => [
              h(InputText, {
                'data-testid': 'profile-name',
                modelValue: draftName.value,
                'onUpdate:modelValue': (value: string | undefined) => {
                  draftName.value = value ?? '';
                },
              }),
              h(Button, {
                'data-testid': 'profile-save',
                label: 'Save',
                onClick: () => {
                  savedName.value = draftName.value;
                  visible.value = false;
                },
              }),
            ],
          }
        ),
        h(Button, {
          'data-testid': 'open-self-anchored-dialog',
          label: 'Open self-anchored dialog',
          onClick: () => {
            selfAnchoredVisible.value = true;
          },
        }),
        h(
          Dialog,
          {
            'data-testid': 'self-anchored-dialog',
            header: 'Self-anchored dialog',
            appendTo: 'self',
            modal: true,
            visible: selfAnchoredVisible.value,
            'onUpdate:visible': (value: boolean) => {
              selfAnchoredVisible.value = value;
            },
          },
          {}
        ),
      ]);
  },
});
