import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example';

import { basicDataGridPremiumUIExample } from './examples/datagridpremium/BasicDataGridPremium.examples';
import { basicDesktopDatePickerUIExample } from './examples/datepicker/DesktopDatePicker.examples';
import { basicSimpleTreeViewUIExample } from './examples/treeview/SimpleTreeView.examples';

export const tocs: ExampleToc[] = [
  {
    label: 'DataGrid Premium',
    path: '/datagridpremium',
    ui: <ExampleList examples={[basicDataGridPremiumUIExample]} />,
  },
  {
    label: 'Desktop Date Picker',
    path: '/datepicker',
    ui: <ExampleList examples={[basicDesktopDatePickerUIExample]} />,
  },
  {
    label: 'Simple Tree View',
    path: '/treeview',
    ui: <ExampleList examples={[basicSimpleTreeViewUIExample]} />,
  },
];
