import { JSX } from 'react';

import { ExampleList } from './components/ExampleList';
import { basicDataGridProUIExample } from './examples/datagridpro/BasicDataGridPro.examples';

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
];
