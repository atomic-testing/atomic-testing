import React from 'react';

import { SelectExample } from './views/Select';

interface IExample {
  label: string;
  path: string;
  ui: JSX.Element;
}

export const examples: IExample[] = [
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
