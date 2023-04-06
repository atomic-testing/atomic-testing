import { ExampleList } from './components/ExampleList';
import {
  alertExamples,
  buttonExamples,
  checkboxExamples,
  dialogExamples,
  inputExamples,
  menuExamples,
  ratingExamples,
  selectExamples,
  sliderExamples,
  switchExamples,
  textFieldExamples,
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
];
