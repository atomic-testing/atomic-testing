import React from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

//#region Complex button
export const ComplexButton: React.FunctionComponent = () => {
  return (
    <Stack direction='row' spacing={1}>
      <Button data-testid='contained' variant='contained'>
        Contained
      </Button>
      <Button data-testid='outlined' variant='outlined'>
        Outlined
      </Button>
      <Button data-testid='text' variant='text'>
        Text
      </Button>
    </Stack>
  );
};

/**
 * Complex Button example from MUI's website
 * @see https://mui.com/material-ui/react-button#description
 */
export const complexButtonUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Complex Button',
  ui: <ComplexButton />,
};
//#endregion
