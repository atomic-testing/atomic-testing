import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import { basicGridColumnConfig, gridData, initialState } from '@atomic-testing/internal-mui-x-test-fixture';
import Box from '@mui/material/Box';
import { DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';

const gridCommonProps: DataGridProProps = {
  columns: basicGridColumnConfig.slice(0, 5),
  rows: gridData.slice(0, 100),
  initialState,
  checkboxSelection: true,
  pagination: true,
  pageSizeOptions: [10, 25, 50],
};

export const BasicDataGridPro: React.FunctionComponent = () => {
  // Giving minWidth so in DOM test the grid will not be too small

  return (
    <Box sx={{ height: 480, minWidth: 800, width: '100%' }} data-testid='basic-grid-pro'>
      <DataGridPro {...gridCommonProps} />
    </Box>
  );
};

/**
 * Basic DataGridPro example from MUI's website
 * @see https://mui.com/material-ui/react-datagridpro#description
 */
export const basicDataGridProUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic DataGridPro',
  ui: <BasicDataGridPro />,
};
//#endregion
