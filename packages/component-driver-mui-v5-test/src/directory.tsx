import { ExampleList } from './components/ExampleList';
import { selectExamples } from './examples';
import { buttonExamples } from './examples/Button.examples';

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
    label: 'Select',
    path: '/select',
    ui: <ExampleList examples={selectExamples} />,
  },
];
