import { defineComponent, h, ref } from 'vue';
import {
  HTMLButtonDriver,
  HTMLCheckboxDriver,
  HTMLRadioButtonGroupDriver,
  HTMLSelectDriver,
  HTMLTextInputDriver,
  HTMLElementDriver,
} from '@atomic-testing/component-driver-html';
import { byDataTestId, byName, IExampleUnit, ScenePart } from '@atomic-testing/core';

export const SimpleFormComponent = defineComponent({
  name: 'SimpleFormComponent',
  setup() {
    const name = ref('');
    const color = ref('red');
    const gender = ref('male');
    const agree = ref(false);
    const message = ref('');

    const onNameInput = (e: Event) => {
      name.value = (e.target as HTMLInputElement).value;
    };
    const onColorChange = (e: Event) => {
      color.value = (e.target as HTMLSelectElement).value;
    };
    const onGenderChange = (e: Event) => {
      gender.value = (e.target as HTMLInputElement).value;
    };
    const onAgreeChange = (e: Event) => {
      agree.value = (e.target as HTMLInputElement).checked;
    };
    const submit = () => {
      message.value = `Name:${name.value};Color:${color.value};Gender:${gender.value};Agree:${agree.value}`;
    };

    return () =>
      h('div', [
        h('input', {
          'data-testid': 'name-input',
          type: 'text',
          value: name.value,
          onInput: onNameInput,
        }),
        h(
          'select',
          {
            'data-testid': 'color-select',
            value: color.value,
            onChange: onColorChange,
          },
          [
            h('option', { value: 'red' }, 'Red'),
            h('option', { value: 'green' }, 'Green'),
            h('option', { value: 'blue' }, 'Blue'),
          ],
        ),
        h('div', { 'data-testid': 'gender-group' }, [
          h('label', [
            h('input', {
              type: 'radio',
              name: 'gender',
              value: 'male',
              'data-testid': 'gender-male',
              checked: gender.value === 'male',
              onChange: onGenderChange,
            }),
            'Male',
          ]),
          h('label', [
            h('input', {
              type: 'radio',
              name: 'gender',
              value: 'female',
              'data-testid': 'gender-female',
              checked: gender.value === 'female',
              onChange: onGenderChange,
            }),
            'Female',
          ]),
        ]),
        h('label', [
          h('input', {
            type: 'checkbox',
            'data-testid': 'agree-checkbox',
            checked: agree.value,
            onChange: onAgreeChange,
          }),
          'Agree to terms',
        ]),
        h(
          'button',
          {
            'data-testid': 'submit-btn',
            type: 'button',
            onClick: submit,
          },
          'Submit',
        ),
        message.value ? h('div', { 'data-testid': 'message-display' }, message.value) : null,
      ]);
  },
});

export const simpleFormUI: IExampleUIUnit<ReturnType<typeof defineComponent>> = {
  title: 'Simple Form',
  ui: SimpleFormComponent,
};

export const simpleFormScene = {
  nameInput: {
    locator: byDataTestId('name-input'),
    driver: HTMLTextInputDriver,
  },
  colorSelect: {
    locator: byDataTestId('color-select'),
    driver: HTMLSelectDriver,
  },
  gender: {
    locator: byName('gender'),
    driver: HTMLRadioButtonGroupDriver,
  },
  agreeCheckbox: {
    locator: byDataTestId('agree-checkbox'),
    driver: HTMLCheckboxDriver,
  },
  submitButton: {
    locator: byDataTestId('submit-btn'),
    driver: HTMLButtonDriver,
  },
  message: {
    locator: byDataTestId('message-display'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const simpleFormExample: IExampleUnit<typeof simpleFormScene, ReturnType<typeof defineComponent>> = {
  ...simpleFormUI,
  scene: simpleFormScene,
};
