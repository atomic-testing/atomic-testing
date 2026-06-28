import { ExampleList, ExampleToc } from '@atomic-testing/internal-react-example';

import { buttonUIExample } from './examples/button/Button.examples';

export const tocs: ExampleToc[] = [
  {
    label: 'Button',
    path: '/button',
    ui: <ExampleList examples={[buttonUIExample]} />,
  },
];
