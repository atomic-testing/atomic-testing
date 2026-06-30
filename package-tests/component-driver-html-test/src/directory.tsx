import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example';

import { activateUIExample } from './examples/activate/Activate.examples';
import { byRoleUIExample } from './examples/byRole/ByRole.examples';
import { checkboxGroupUIExample } from './examples/checkbox/CheckboxGroup.examples';
import { singleCheckboxUIExample } from './examples/checkbox/SingleCheckbox.examples';
import { contextMenuUIExample } from './examples/contextMenu/ContextMenu.examples';
import { dragUIExample } from './examples/drag/Drag.examples';
import { elementNotFoundUIExample } from './examples/elementNotFound/ElementNotFound.examples';
import { fileUploadUIExample } from './examples/fileUpload/FileUpload.examples';
import { focusEventUIExample } from './examples/focusEvent/Focus.examples';
import { linkedElementUIExample } from './examples/form/LinkedElement.examples';
import { controlledTextInputUIExample } from './examples/input/Controlled.examples';
import { uncontrolledTextInputUIExample } from './examples/input/Uncontrolled.examples';
import { keyboardEventUIExample } from './examples/keyboardEvent/KeyboardEvent.examples';
import { clickLocationMouseEventUIExample } from './examples/mouseEvent/ClickLocation.examples';
import { hoverMouseEventUIExample } from './examples/mouseEvent/Hover.examples';
import { mouseLocationMouseEventUIExample } from './examples/mouseEvent/MouseLocation.examples';
import { mouseOverMouseEventUIExample } from './examples/mouseEvent/MouseOver.examples';
import { uncontrolledRadioButtonGroupUIExample } from './examples/radioButtonGroup/Uncontrolled.examples';
import { rangeInputUIExample } from './examples/rangeInput/RangeInput.examples';
import { scrollUIExample } from './examples/scroll/Scroll.examples';
import { multipleSelectUIExample } from './examples/select/MultipleSelect.examples';
import { singleSelectUIExample } from './examples/select/SingleSelect.examples';

export const tocs: ExampleToc[] = [
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
    label: 'Keyboard Event',
    path: '/keyboard-event',
    ui: <ExampleList examples={[keyboardEventUIExample]} />,
  },
  {
    label: 'By Role',
    path: '/by-role',
    ui: <ExampleList examples={[byRoleUIExample]} />,
  },
  {
    label: 'File Upload',
    path: '/file-upload',
    ui: <ExampleList examples={[fileUploadUIExample]} />,
  },
  {
    label: 'Activate',
    path: '/activate',
    ui: <ExampleList examples={[activateUIExample]} />,
  },
  {
    label: 'Range Input',
    path: '/range-input',
    ui: <ExampleList examples={[rangeInputUIExample]} />,
  },
  {
    label: 'Context Menu',
    path: '/context-menu',
    ui: <ExampleList examples={[contextMenuUIExample]} />,
  },
  {
    label: 'Scroll',
    path: '/scroll',
    ui: <ExampleList examples={[scrollUIExample]} />,
  },
  {
    label: 'Drag',
    path: '/drag',
    ui: <ExampleList examples={[dragUIExample]} />,
  },
  {
    label: 'Element Not Found',
    path: '/element-not-found',
    ui: <ExampleList examples={[elementNotFoundUIExample]} />,
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
