import { createTestEngine } from '@atomic-testing/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import { lightTheme } from '../themes/theme';

type Props = {
  children: ReactNode;
};

export const ComponentWrapper = ({ children }: Props) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const createTestEngineForComponent: typeof createTestEngine = (node, partDefinitions, option) => {
  return createTestEngine(<ComponentWrapper>{node}</ComponentWrapper>, partDefinitions, option);
};
