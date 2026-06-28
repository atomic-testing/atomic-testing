import { IExampleUIUnit } from '@atomic-testing/core';
import { basicGridColumnConfig, gridData, initialState } from '@atomic-testing/internal-mui-x-test-fixture';
import Box from '@mui/material/Box';
import { DataGridPremium, DataGridPremiumProps, GridColDef } from '@mui/x-data-grid-premium';
import React, { JSX } from 'react';

const gridCommonProps: DataGridPremiumProps = {
  // The shared fixture widens column `type` to `string`; the first five columns are untyped,
  // so this slice is safe to present as GridColDef[].
  columns: basicGridColumnConfig.slice(0, 5) as GridColDef[],
  rows: gridData.slice(0, 100),
  initialState,
  checkboxSelection: true,
  pagination: true,
  pageSizeOptions: [10, 25, 50],
};

export const BasicDataGridPremium: React.FunctionComponent = () => {
  // Giving minWidth so in DOM test the grid will not be too small

  return (
    <Box sx={{ height: 480, minWidth: 800, width: '100%' }} data-testid='basic-grid-premium'>
      <DataGridPremium {...gridCommonProps} />
    </Box>
  );
};

/**
 * Basic DataGridPremium example from MUI's website
 * @see https://mui.com/x/react-data-grid/
 */
export const basicDataGridPremiumUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic DataGridPremium',
  ui: <BasicDataGridPremium />,
};
//#endregion
