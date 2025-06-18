import { ReactNode } from 'react';

import { createTestEngine } from '@atomic-testing/react-18';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { lightTheme } from '../themes/theme';

type Props = {
  children: ReactNode;
};

const ComponentWrapper = ({ children }: Props) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export const createTestEngineForComponent: typeof createTestEngine = (node, partDefinitions, option) => {
  return createTestEngine(<ComponentWrapper>{node}</ComponentWrapper>, partDefinitions, option);
};
