import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

//#region Alert
export const BasicAlert: React.FunctionComponent = () => {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert data-testid='error' severity='error'>
        <AlertTitle>Error</AlertTitle>
        <strong>code: red</strong> — This is an error alert — check it out!
      </Alert>
      <Alert data-testid='warning' severity='warning'>
        <AlertTitle>Warning</AlertTitle>
        <strong>code: yellow</strong> — This is a warning alert — check it out!
      </Alert>
      <Alert data-testid='info' severity='info'>
        This is an info alert — check it out!
      </Alert>
      <Alert data-testid='success' severity='success'>
        This is a success alert — check it out!
      </Alert>
    </Stack>
  );
};

/**
 * Basic Alert example from MUI's website
 * @see https://mui.com/material-ui/react-alert#description
 */
export const basicAlertUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Alert',
  ui: <BasicAlert />,
};
//#endregion
