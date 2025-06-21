import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example';

import { basicDataGridProUIExample } from './examples/datagridpro/BasicDataGridPro.examples';

export const tocs: ExampleToc[] = [
  {
    label: 'DataGrid Pro',
    path: '/datagridpro',
    ui: <ExampleList examples={[basicDataGridProUIExample]} />,
  },
];
