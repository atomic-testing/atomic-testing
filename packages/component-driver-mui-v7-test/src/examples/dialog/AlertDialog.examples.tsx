import * as React from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

/**
 * Based on Alert dialog example from MUI
 * @see https://mui.com/material-ui/react-dialog/#alerts
 */
export const AlertExample = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button data-testid='alert-open-trigger' variant='outlined' onClick={handleClickOpen}>
        Open alert dialog
      </Button>
      <Dialog
        data-testid='alert-dialog'
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Let Google help apps determine location. This means sending anonymous location data to Google, even when no
            apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button data-testid='disagree-button' onClick={handleClose}>
            Disagree
          </Button>
          <Button data-testid='agree-button' onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export const alertDialogUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Alert dialog',
  ui: <AlertExample />,
};
