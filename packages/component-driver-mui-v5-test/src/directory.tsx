import { ExampleList } from './components/ExampleList';
import { selectExamples } from './examples';
import { buttonExamples } from './examples/Button.examples';
import { checkboxExamples } from './examples/Checkbox.examples';

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
    label: 'Select',
    path: '/select',
    ui: <ExampleList examples={selectExamples} />,
  },
];
