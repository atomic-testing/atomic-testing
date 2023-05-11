import { ExampleList } from './components/ExampleList';
import {
  alertExamples,
  autoCompleteExamples,
  buttonExamples,
  checkboxExamples,
  dataGridProExamples,
  dialogExamples,
  inputExamples,
  listExamples,
  menuExamples,
  ratingExamples,
  selectExamples,
  sliderExamples,
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
    label: 'DataGrid Pro',
    path: '/datagridpro',
    ui: <ExampleList examples={dataGridProExamples} />,
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
