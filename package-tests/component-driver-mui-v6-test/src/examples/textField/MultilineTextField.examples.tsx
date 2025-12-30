import { JSX } from 'react';
import { IExampleUIUnit } from '@atomic-testing/core';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

//#region Multiline TextField
export const MultilineTextField = () => {
  return (
    <Box component='form' noValidate autoComplete='off'>
      <TextField data-testid='multiline' label='Multiline' multiline rows={4} defaultValue='Default Value' />
    </Box>
  );
};

/**
 * Multiline TextField example from MUI's website
 * @see https://mui.com/material-ui/react-text-field/#multiline
 */
export const multilineTextFieldUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Multiline TextField',
  ui: <MultilineTextField />,
};
//#endregion
