import { ExampleList } from './components/ExampleList';
import {
  checkboxExamples,
  formExamples,
  mouseEventExamples,
  radioButtonGroupExamples,
  selectExamples,
  textInputExamples,
} from './examples';

interface IToc {
  label: string;
  path: string;
  ui: JSX.Element;
}

export const tocs: IToc[] = [
  {
    label: 'Form',
    path: '/form',
    ui: <ExampleList examples={formExamples} />,
  },
  {
    label: 'Text Input',
    path: '/input',
    ui: <ExampleList examples={textInputExamples} />,
  },
  {
    label: 'Radio Buttons',
    path: '/radio-buttons',
    ui: <ExampleList examples={radioButtonGroupExamples} />,
  },
  {
    label: 'Checkbox',
    path: '/checkbox',
    ui: <ExampleList examples={checkboxExamples} />,
  },
  {
    label: 'Select',
    path: '/select',
    ui: <ExampleList examples={selectExamples} />,
  },
  {
    label: 'Mouse Event',
    path: '/mouse-event',
    ui: <ExampleList examples={mouseEventExamples} />,
  },
];
