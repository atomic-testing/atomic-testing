import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Box from '@mui/material/Box';
import { DataGridPro } from '@mui/x-data-grid-pro';

import { basicGridColumnConfig, initialState } from './gridConfig';
import { gridData } from './gridData';

export const BasicDataGridPro: React.FunctionComponent = () => {
  // Giving minWidth so in DOM test the grid will not be too small
  return (
    <Box data-testid='basic-grid-pro' sx={{ height: 520, minWidth: 1200, width: '100%' }}>
      <DataGridPro
        columns={basicGridColumnConfig}
        rows={gridData}
        initialState={initialState}
        loading={gridData.length === 0}
        rowHeight={38}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
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
