import { createTheme } from '@mui/material/styles';

// A light, compact theme — nothing the drivers depend on, just a pleasant default for the demo.
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3949ab' },
  },
  shape: { borderRadius: 8 },
});
