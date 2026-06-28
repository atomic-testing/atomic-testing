import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example';

import { basicAccordionUIExample } from './examples/accordion/BasicAccordion.examples';
import { basicAlertUIExample } from './examples/alert/BasicAlert.examples';
import { basicAutoCompleteUIExample } from './examples/autocomplete/BasicAutoComplete.examples';
import { basicAvatarUIExample } from './examples/avatar/BasicAvatar.example';
import { basicBadgeUIExample } from './examples/badge/BasicBadge.examples';
import { basicBottomNavigationUIExample } from './examples/bottomNavigation/BasicBottomNavigation.example';
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
import { basicDrawerUIExample } from './examples/drawer/BasicDrawer.example';
import { basicInputUIExample } from './examples/input/BasicInput.examples';
import { selectableListUIExample } from './examples/list/SelectableList.example';
import { accountMenuUIExample } from './examples/menu/AccountMenu.examples';
import { basicPaginationUIExample } from './examples/pagination/BasicPagination.example';
import { basicProgressUIExample } from './examples/progress/Progress.examples';
import { basicRadioGroupUIExample } from './examples/radio/BasicRadioGroup.example';
import { basicRatingUIExample } from './examples/rating/Rating.examples';
import { basicSelectUIExample } from './examples/select/BasicSelect.examples';
import { nativeSelectUIExample } from './examples/select/NativeSelect.examples';
import { basicSliderUIExample } from './examples/slider/BasicSlider.examples';
import { basicSnackbarUIExample } from './examples/snackbar/BasicSnackbar.examples';
import { basicSpeedDialUIExample } from './examples/speedDial/BasicSpeedDial.example';
import { basicStepperUIExample } from './examples/stepper/BasicStepper.example';
import { basicSwitchUIExample } from './examples/switch/BasicSwitch.examples';
import { basicTableUIExample } from './examples/table/BasicTable.example';
import { basicTablePaginationUIExample } from './examples/tablePagination/BasicTablePagination.example';
import { basicTabsUIExample } from './examples/tabs/BasicTabs.example';
import { basicTextFieldUIExample } from './examples/textField/BasicTextField.examples';
import { dateTextFieldUIExample } from './examples/textField/DateTextField.examples';
import { multilineTextFieldUIExample } from './examples/textField/MultilineTextField.examples';
import { readonlyAndDisabledTextFieldUIExample } from './examples/textField/ReadonlyDisabledTextField.examples';
import { selectTextFieldUIExample } from './examples/textField/SelectTextField.examples';
import { exclusiveSelectionUIExample } from './examples/toggleButton/ExclusiveSelection.example';
import { regularSelectionUIExample } from './examples/toggleButton/MultipleSelection.example';
import { singleToggleUIExample } from './examples/toggleButton/SingleToggle.example';
import { basicTooltipUIExample } from './examples/tooltip/BasicTooltip.example';

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
    label: 'Avatar',
    path: '/avatar',
    ui: <ExampleList examples={[basicAvatarUIExample]} />,
  },
  {
    label: 'Badge',
    path: '/badge',
    ui: <ExampleList examples={[basicBadgeUIExample]} />,
  },
  {
    label: 'BottomNavigation',
    path: '/bottom-navigation',
    ui: <ExampleList examples={[basicBottomNavigationUIExample]} />,
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
    label: 'Drawer',
    path: '/drawer',
    ui: <ExampleList examples={[basicDrawerUIExample]} />,
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
    label: 'Pagination',
    path: '/pagination',
    ui: <ExampleList examples={[basicPaginationUIExample]} />,
  },
  {
    label: 'Progress',
    path: '/progress',
    ui: <ExampleList examples={[basicProgressUIExample]} />,
  },
  {
    label: 'Radio',
    path: '/radio',
    ui: <ExampleList examples={[basicRadioGroupUIExample]} />,
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
    label: 'SpeedDial',
    path: '/speed-dial',
    ui: <ExampleList examples={[basicSpeedDialUIExample]} />,
  },
  {
    label: 'Stepper',
    path: '/stepper',
    ui: <ExampleList examples={[basicStepperUIExample]} />,
  },
  {
    label: 'Switch',
    path: '/switch',
    ui: <ExampleList examples={[basicSwitchUIExample]} />,
  },
  {
    label: 'Table',
    path: '/table',
    ui: <ExampleList examples={[basicTableUIExample]} />,
  },
  {
    label: 'TablePagination',
    path: '/table-pagination',
    ui: <ExampleList examples={[basicTablePaginationUIExample]} />,
  },
  {
    label: 'Tabs',
    path: '/tabs',
    ui: <ExampleList examples={[basicTabsUIExample]} />,
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
  {
    label: 'Tooltip',
    path: '/tooltip',
    ui: <ExampleList examples={[basicTooltipUIExample]} />,
  },
];
