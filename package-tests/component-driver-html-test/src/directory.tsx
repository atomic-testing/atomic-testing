import { JSX } from 'react';

import { ExampleList } from './components/ExampleList';
import { checkboxGroupUIExample } from './examples/checkbox/CheckboxGroup.examples';
import { singleCheckboxUIExample } from './examples/checkbox/SingleCheckbox.examples';
import { focusEventUIExample } from './examples/focusEvent/Focus.examples';
import { linkedElementUIExample } from './examples/form/LinkedElement.examples';
import { controlledTextInputUIExample } from './examples/input/Controlled.examples';
import { uncontrolledTextInputUIExample } from './examples/input/Uncontrolled.examples';
import { clickLocationMouseEventUIExample } from './examples/mouseEvent/ClickLocation.examples';
import { hoverMouseEventUIExample } from './examples/mouseEvent/Hover.examples';
import { mouseLocationMouseEventUIExample } from './examples/mouseEvent/MouseLocation.examples';
import { mouseOverMouseEventUIExample } from './examples/mouseEvent/MouseOver.examples';
import { uncontrolledRadioButtonGroupUIExample } from './examples/radioButtonGroup/Uncontrolled.examples';
import { multipleSelectUIExample } from './examples/select/MultipleSelect.examples';
import { singleSelectUIExample } from './examples/select/SingleSelect.examples';

interface IToc {
  label: string;
  path: string;
  ui: JSX.Element;
}

export const tocs: IToc[] = [
  {
    label: 'Form',
    path: '/form',
    ui: <ExampleList examples={[linkedElementUIExample]} />,
  },
  {
    label: 'Text Input',
    path: '/input',
    ui: <ExampleList examples={[uncontrolledTextInputUIExample, controlledTextInputUIExample]} />,
  },
  {
    label: 'Radio Buttons',
    path: '/radio-buttons',
    ui: <ExampleList examples={[uncontrolledRadioButtonGroupUIExample]} />,
  },
  {
    label: 'Checkbox',
    path: '/checkbox',
    ui: <ExampleList examples={[singleCheckboxUIExample, checkboxGroupUIExample]} />,
  },
  {
    label: 'Select',
    path: '/select',
    ui: <ExampleList examples={[singleSelectUIExample, multipleSelectUIExample]} />,
  },
  {
    label: 'Focus Event',
    path: '/focus-event',
    ui: <ExampleList examples={[focusEventUIExample]} />,
  },
  {
    label: 'Mouse Event',
    path: '/mouse-event',
    ui: (
      <ExampleList
        examples={[
          hoverMouseEventUIExample,
          clickLocationMouseEventUIExample,
          mouseLocationMouseEventUIExample,
          mouseOverMouseEventUIExample,
        ]}
      />
    ),
  },
];
