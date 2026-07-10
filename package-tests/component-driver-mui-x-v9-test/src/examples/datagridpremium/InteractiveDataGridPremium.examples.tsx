import { IExampleUIUnit } from '@atomic-testing/core';
import { basicGridColumnConfig, gridData } from '@atomic-testing/internal-mui-x-test-fixture';
import Box from '@mui/material/Box';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import React, { JSX } from 'react';

// The shared fixture marks every column non-editable; the editing tests need one editable
// column, so commodity is flipped here.
const interactiveColumns = (basicGridColumnConfig.slice(0, 5) as GridColDef[]).map(col => ({
  ...col,
  editable: col.field === 'commodity',
}));

export const interactiveGridRows = gridData.slice(0, 30);

export const InteractiveDataGridPremium: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <Box sx={{ height: 480, minWidth: 900, width: '100%' }} data-testid='interactive-grid-premium'>
        <DataGridPremium
          columns={interactiveColumns}
          rows={interactiveGridRows}
          showToolbar
          checkboxSelection
          pagination
          pageSizeOptions={[10, 25]}
          initialState={{
            columns: { columnVisibilityModel: { id: false } },
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>
      {/* A grid with no rows, for the empty-state overlay. */}
      <Box sx={{ height: 300, minWidth: 900, width: '100%' }} data-testid='empty-grid-premium'>
        <DataGridPremium columns={interactiveColumns} rows={[]} />
      </Box>
    </React.Fragment>
  );
};

/**
 * DataGridPremium with its interactive surface enabled: toolbar (quick filter, filter panel),
 * checkbox selection, an editable column, and pagination.
 * @see https://mui.com/x/react-data-grid/
 */
export const interactiveDataGridPremiumUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Interactive DataGridPremium',
  ui: <InteractiveDataGridPremium />,
};
