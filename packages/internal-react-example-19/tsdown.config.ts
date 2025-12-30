import { defineConfig } from 'tsdown';

import commonConfig from '../../tsdown.config.base.ts';

export default defineConfig({
  ...commonConfig,
  inputOptions: {
    transform: {
      jsx: 'react',
    },
  },
});
