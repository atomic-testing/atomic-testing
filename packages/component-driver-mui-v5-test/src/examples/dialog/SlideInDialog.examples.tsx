import * as React from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

/**
 * Based on Transitions example from MUI dialog
 * @see https://mui.com/material-ui/react-dialog/#transitions
 */
export const SlideInExample = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button data-testid='slidein-open-trigger' variant='outlined' onClick={handleClickOpen}>
        Open slide in dialog
      </Button>
      <Dialog
        data-testid='slidein-dialog'
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby='slidein-dialog-title'
        aria-describedby='slidein-dialog-description'>
        <DialogTitle id='slidein-dialog-title'>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='slidein-dialog-description'>
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

export const slideInDialogUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'SlideIn dialog',
  ui: <SlideInExample />,
};
