import { ExampleList } from './components/ExampleList';
import { dataGridProExamples, datePickerExamples } from './examples';

interface IToc {
  label: string;
  path: string;
  ui: JSX.Element;
}

export const tocs: IToc[] = [
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
];
