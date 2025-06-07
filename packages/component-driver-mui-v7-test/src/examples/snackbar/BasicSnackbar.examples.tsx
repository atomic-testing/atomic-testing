import * as React from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';

//#region Snackbar
export const BasicSnackbar: React.FunctionComponent = () => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton data-testid='close-button' size='small' aria-label='close' color='inherit' onClick={handleClose}>
        <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Button data-testid='snack-opener' onClick={handleClick}>
        Open simple snackbar
      </Button>
      <Snackbar
        data-testid='basic-snackbar'
        open={open}
        autoHideDuration={6000000}
        onClose={handleClose}
        message='Note archived'
        action={action}
      />
    </div>
  );
};

/**
 * Basic Snackbar example from MUI's website
 * @see https://mui.com/material-ui/react-snackbar#description
 */
export const basicSnackbarUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Snackbar',
  ui: <BasicSnackbar />,
};
//#endregion
