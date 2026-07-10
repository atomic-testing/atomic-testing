import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example';

import { basicChartsUIExample } from './examples/charts/Charts.examples';
import { basicDataGridPremiumUIExample } from './examples/datagridpremium/BasicDataGridPremium.examples';
import { groupedDataGridPremiumUIExample } from './examples/datagridpremium/GroupedDataGridPremium.examples';
import { interactiveDataGridPremiumUIExample } from './examples/datagridpremium/InteractiveDataGridPremium.examples';
import { basicDateRangePickerUIExample } from './examples/datepicker/DateRangePicker.examples';
import { basicDateTimePickerUIExample } from './examples/datepicker/DateTimePicker.examples';
import { basicDesktopDatePickerUIExample } from './examples/datepicker/DesktopDatePicker.examples';
import { basicMobileDatePickerUIExample } from './examples/datepicker/MobileDatePicker.examples';
import { basicTimePickerUIExample } from './examples/datepicker/TimePicker.examples';
import { basicSimpleTreeViewUIExample } from './examples/treeview/SimpleTreeView.examples';

export const tocs: ExampleToc[] = [
  {
    label: 'Charts',
    path: '/charts',
    ui: <ExampleList examples={[basicChartsUIExample]} />,
  },
  {
    label: 'DataGrid Premium',
    path: '/datagridpremium',
    ui: <ExampleList examples={[basicDataGridPremiumUIExample]} />,
  },
  {
    label: 'Interactive DataGrid Premium',
    path: '/datagridinteractive',
    ui: <ExampleList examples={[interactiveDataGridPremiumUIExample]} />,
  },
  {
    label: 'Grouped DataGrid Premium',
    path: '/datagridgrouped',
    ui: <ExampleList examples={[groupedDataGridPremiumUIExample]} />,
  },
  {
    label: 'Desktop Date Picker',
    path: '/datepicker',
    ui: <ExampleList examples={[basicDesktopDatePickerUIExample]} />,
  },
  {
    label: 'Date Time Picker',
    path: '/datetimepicker',
    ui: <ExampleList examples={[basicDateTimePickerUIExample]} />,
  },
  {
    label: 'Time Picker',
    path: '/timepicker',
    ui: <ExampleList examples={[basicTimePickerUIExample]} />,
  },
  {
    label: 'Mobile Date Picker',
    path: '/mobiledatepicker',
    ui: <ExampleList examples={[basicMobileDatePickerUIExample]} />,
  },
  {
    label: 'Date Range Picker',
    path: '/daterangepicker',
    ui: <ExampleList examples={[basicDateRangePickerUIExample]} />,
  },
  {
    label: 'Simple Tree View',
    path: '/treeview',
    ui: <ExampleList examples={[basicSimpleTreeViewUIExample]} />,
  },
];
