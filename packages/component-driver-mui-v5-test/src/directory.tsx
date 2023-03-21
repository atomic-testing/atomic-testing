import { ExampleList } from './components/ExampleList';
import { selectExamples } from './examples';
import { buttonExamples } from './examples/Button.examples';
import { checkboxExamples } from './examples/Checkbox.examples';
import { inputExamples } from './examples/Input.examples';
import { ratingExamples } from './examples/Rating.examples';
import { textFieldExamples } from './examples/TextField.examples';

interface IToc {
  label: string;
  path: string;
  ui: JSX.Element;
}

export const tocs: IToc[] = [
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
    label: 'Input',
    path: '/input',
    ui: <ExampleList examples={inputExamples} />,
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
    label: 'TextField',
    path: '/textfield',
    ui: <ExampleList examples={textFieldExamples} />,
  },
];
