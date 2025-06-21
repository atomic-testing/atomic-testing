import React from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Chip from '@mui/material/Chip';

//#region Chip
export const BasicChip: React.FunctionComponent = () => {
  return <Chip label='Chirpy' data-testid='basic-chip' />;
};

/**
 * Basic Chip example from MUI's website
 * @see https://mui.com/material-ui/react-chip#description
 */
export const basicChipUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Chip',
  ui: <BasicChip />,
};
//#endregion
