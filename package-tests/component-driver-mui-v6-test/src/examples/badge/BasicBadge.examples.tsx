import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';

//#region Badge
export const BasicBadge: React.FunctionComponent = () => {
  return (
    <Badge badgeContent={12} color='primary' data-testid='basic-badge'>
      <MailIcon color='action' />
    </Badge>
  );
};

/**
 * Basic Badge example from MUI's website
 * @see https://mui.com/material-ui/react-badge#description
 */
export const basicBadgeUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Badge',
  ui: <BasicBadge />,
};
//#endregion
