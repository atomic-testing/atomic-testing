import { ExampleList } from '@atomic-testing/internal-react-example';
import { basicDataGridProUIExample } from './examples/datagridpro/BasicDataGridPro.examples';
import { basicDatePickerUIExample } from './examples/datetimepicker/BasicDateTimePicker.examples';
import { basicDateRangePickerUIExample } from './examples/datetimepicker/DateRangePicker.examples';

interface IToc {
  label: string;
  path: string;
  ui: JSX.Element;
}

export const tocs: IToc[] = [
  {
    label: 'DataGrid Pro',
    path: '/datagridpro',
    ui: <ExampleList examples={[basicDataGridProUIExample]} />,
  },
  {
    label: 'DatePicker',
    path: '/datepicker',
    ui: <ExampleList examples={[basicDatePickerUIExample, basicDateRangePickerUIExample]} />,
  },
];
