import React from 'react';

import { HTMLInputExample } from './views/HTMLInputExample';
import { HTMLRadioButtonGroupExample } from './views/HTMLRadioButtonGroupExample';

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
  {
    label: 'Radio Buttons',
    path: '/radio-buttons',
    ui: <HTMLRadioButtonGroupExample />,
  },
];
