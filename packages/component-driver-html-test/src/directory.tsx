import React from 'react';

import { HTMLInputExample } from './views/Select';

interface IToc {
  label: string;
  path: string;
  ui: JSX.Element;
}

export const tocs: IToc[] = [
  {
    label: 'Text Input',
    path: '/input',
    ui: <HTMLInputExample />,
  },
];
