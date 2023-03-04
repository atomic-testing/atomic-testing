import React from 'react';

import { SelectExample } from './views/Select';

interface IToc {
  label: string;
  path: string;
  ui: JSX.Element;
}

export const tocs: IToc[] = [
  {
    label: 'Button',
    path: '/button',
    ui: <SelectExample />,
  },
  {
    label: 'Select',
    path: '/select',
    ui: <SelectExample />,
  },
];
