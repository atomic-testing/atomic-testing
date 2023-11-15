import { ExampleList } from './components/ExampleList';
import {
  accordionExamples,
  alertExamples,
  autoCompleteExamples,
  badgeExamples,
  buttonExamples,
  checkboxExamples,
  chipExamples,
  dataGridProExamples,
  datePickerExamples,
  dialogExamples,
  inputExamples,
  listExamples,
  menuExamples,
  ratingExamples,
  selectExamples,
  sliderExamples,
  snackbarExamples,
  switchExamples,
  textFieldExamples,
  toggleButtonExamples,
} from './examples';

interface IToc {
  label: string;
  path: string;
  ui: JSX.Element;
}

export const tocs: IToc[] = [
  {
    label: 'Accordion',
    path: '/accordion',
    ui: <ExampleList examples={accordionExamples} />,
  },
  {
    label: 'Alert',
    path: '/alert',
    ui: <ExampleList examples={alertExamples} />,
  },
  {
    label: 'AutoComplete',
    path: '/autocomplete',
    ui: <ExampleList examples={autoCompleteExamples} />,
  },
  {
    label: 'Badge',
    path: '/badge',
    ui: <ExampleList examples={badgeExamples} />,
  },
  {
    label: 'Button',
    path: '/button',
    ui: <ExampleList examples={buttonExamples} />,
  },
  {
    label: 'Checkbox',
    path: '/checkbox',
    ui: <ExampleList examples={checkboxExamples} />,
  },
  {
    label: 'Chip',
    path: '/chip',
    ui: <ExampleList examples={chipExamples} />,
  },
  {
    label: 'DataGrid Pro',
    path: '/datagridpro',
    ui: <ExampleList examples={dataGridProExamples} />,
  },
  {
    label: 'DatePicker',
    path: '/datepicker',
    ui: <ExampleList examples={datePickerExamples} />,
  },
  {
    label: 'Dialog',
    path: '/dialog',
    ui: <ExampleList examples={dialogExamples} />,
  },
  {
    label: 'Input',
    path: '/input',
    ui: <ExampleList examples={inputExamples} />,
  },
  {
    label: 'List',
    path: '/list',
    ui: <ExampleList examples={listExamples} />,
  },
  {
    label: 'Menu',
    path: '/menu',
    ui: <ExampleList examples={menuExamples} />,
  },
  {
    label: 'Rating',
    path: '/rating',
    ui: <ExampleList examples={ratingExamples} />,
  },
  {
    label: 'Select',
    path: '/select',
    ui: <ExampleList examples={selectExamples} />,
  },
  {
    label: 'Slider',
    path: '/slider',
    ui: <ExampleList examples={sliderExamples} />,
  },
  {
    label: 'Snackbar',
    path: '/snackbar',
    ui: <ExampleList examples={snackbarExamples} />,
  },
  {
    label: 'Switch',
    path: '/switch',
    ui: <ExampleList examples={switchExamples} />,
  },
  {
    label: 'TextField',
    path: '/textfield',
    ui: <ExampleList examples={textFieldExamples} />,
  },
  {
    label: 'ToggleButton',
    path: '/toggle-button',
    ui: <ExampleList examples={toggleButtonExamples} />,
  },
];
