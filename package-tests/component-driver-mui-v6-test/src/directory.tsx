import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example-18';

import { basicAccordionUIExample } from './examples/accordion/BasicAccordion.examples';
import { basicAlertUIExample } from './examples/alert/BasicAlert.examples';
import { basicAutoCompleteUIExample } from './examples/autocomplete/BasicAutoComplete.examples';
import { basicBadgeUIExample } from './examples/badge/BasicBadge.examples';
import { complexButtonUIExample } from './examples/button/ComplexButton.example';
import { iconAndLabelButtonUIExample } from './examples/button/IconAndLabelButton.example';
import { iconCheckboxUIExample } from './examples/checkbox/IconCheckbox.examples';
import { indeterminateCheckboxUIExample } from './examples/checkbox/IndeterminateCheckbox.examples';
import { labelCheckboxUIExample } from './examples/checkbox/LabelCheckbox.examples';
import { basicChipUIExample } from './examples/chip/BasicChip.examples';
import { clickableChipUIExample } from './examples/chip/ClickableChip.examples';
import { deletableChipUIExample } from './examples/chip/DeletableChip.examples';
import { alertDialogUIExample } from './examples/dialog/AlertDialog.examples';
import { slideInDialogUIExample } from './examples/dialog/SlideInDialog.examples';
import { basicInputUIExample } from './examples/input/BasicInput.examples';
import { selectableListUIExample } from './examples/list/SelectableList.example';
import { accountMenuUIExample } from './examples/menu/AccountMenu.examples';
import { basicProgressUIExample } from './examples/progress/Progress.examples';
import { basicRatingUIExample } from './examples/rating/Rating.examples';
import { basicSelectUIExample } from './examples/select/BasicSelect.examples';
import { nativeSelectUIExample } from './examples/select/NativeSelect.examples';
import { basicSliderUIExample } from './examples/slider/BasicSlider.examples';
import { basicSnackbarUIExample } from './examples/snackbar/BasicSnackbar.examples';
import { basicSwitchUIExample } from './examples/switch/BasicSwitch.examples';
import { basicTextFieldUIExample } from './examples/textField/BasicTextField.examples';
import { dateTextFieldUIExample } from './examples/textField/DateTextField.examples';
import { multilineTextFieldUIExample } from './examples/textField/MultilineTextField.examples';
import { readonlyAndDisabledTextFieldUIExample } from './examples/textField/ReadonlyDisabledTextField.examples';
import { selectTextFieldUIExample } from './examples/textField/SelectTextField.examples';
import { exclusiveSelectionUIExample } from './examples/toggleButton/ExclusiveSelection.example';
import { regularSelectionUIExample } from './examples/toggleButton/MultipleSelection.example';
import { singleToggleUIExample } from './examples/toggleButton/SingleToggle.example';

export const tocs: ExampleToc[] = [
  {
    label: 'Accordion',
    path: '/accordion',
    ui: <ExampleList examples={[basicAccordionUIExample]} />,
  },
  {
    label: 'Alert',
    path: '/alert',
    ui: <ExampleList examples={[basicAlertUIExample]} />,
  },
  {
    label: 'AutoComplete',
    path: '/autocomplete',
    ui: <ExampleList examples={[basicAutoCompleteUIExample]} />,
  },
  {
    label: 'Badge',
    path: '/badge',
    ui: <ExampleList examples={[basicBadgeUIExample]} />,
  },
  {
    label: 'Button',
    path: '/button',
    ui: <ExampleList examples={[complexButtonUIExample, iconAndLabelButtonUIExample]} />,
  },
  {
    label: 'Checkbox',
    path: '/checkbox',
    ui: <ExampleList examples={[iconCheckboxUIExample, indeterminateCheckboxUIExample, labelCheckboxUIExample]} />,
  },
  {
    label: 'Chip',
    path: '/chip',
    ui: <ExampleList examples={[basicChipUIExample, clickableChipUIExample, deletableChipUIExample]} />,
  },
  {
    label: 'Dialog',
    path: '/dialog',
    ui: <ExampleList examples={[alertDialogUIExample, slideInDialogUIExample]} />,
  },
  {
    label: 'Input',
    path: '/input',
    ui: <ExampleList examples={[basicInputUIExample]} />,
  },
  {
    label: 'List',
    path: '/list',
    ui: <ExampleList examples={[selectableListUIExample]} />,
  },
  {
    label: 'Menu',
    path: '/menu',
    ui: <ExampleList examples={[accountMenuUIExample]} />,
  },
  {
    label: 'Progress',
    path: '/progress',
    ui: <ExampleList examples={[basicProgressUIExample]} />,
  },
  {
    label: 'Rating',
    path: '/rating',
    ui: <ExampleList examples={[basicRatingUIExample]} />,
  },
  {
    label: 'Select',
    path: '/select',
    ui: <ExampleList examples={[basicSelectUIExample, nativeSelectUIExample]} />,
  },
  {
    label: 'Slider',
    path: '/slider',
    ui: <ExampleList examples={[basicSliderUIExample]} />,
  },
  {
    label: 'Snackbar',
    path: '/snackbar',
    ui: <ExampleList examples={[basicSnackbarUIExample]} />,
  },
  {
    label: 'Switch',
    path: '/switch',
    ui: <ExampleList examples={[basicSwitchUIExample]} />,
  },
  {
    label: 'TextField',
    path: '/textfield',
    ui: (
      <ExampleList
        examples={[
          basicTextFieldUIExample,
          dateTextFieldUIExample,
          multilineTextFieldUIExample,
          readonlyAndDisabledTextFieldUIExample,
          selectTextFieldUIExample,
        ]}
      />
    ),
  },
  {
    label: 'ToggleButton',
    path: '/toggle-button',
    ui: <ExampleList examples={[singleToggleUIExample, regularSelectionUIExample, exclusiveSelectionUIExample]} />,
  },
];
