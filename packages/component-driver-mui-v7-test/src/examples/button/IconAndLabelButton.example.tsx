import React from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

//#region Icon & label button
export const IconAndLabelButton: React.FunctionComponent = () => {
  return (
    <Stack direction='row' spacing={2}>
      <Button data-testid='icon-button' variant='outlined' startIcon={<DeleteIcon />}>
        Delete
      </Button>
      <Button data-testid='icon-label-button' variant='contained' endIcon={<SendIcon />}>
        Send
      </Button>
    </Stack>
  );
};

/**
 * Icon and label button example from MUI's website
 * @see https://mui.com/material-ui/react-button#icon-and-label-buttons
 */
export const iconAndLabelButtonUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Icon & Label',
  ui: <IconAndLabelButton />,
};
//#endregion
