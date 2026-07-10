import { IExampleUIUnit } from '@atomic-testing/core';
import { basicGridColumnConfig, gridData } from '@atomic-testing/internal-mui-x-test-fixture';
import Box from '@mui/material/Box';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import React, { JSX } from 'react';

// Columns 0-8 of the shared fixture include `status` (the grouping column) and `quantity` (the
// aggregated column). `status` is grouped over `commodity` because the fixture has only four
// distinct statuses across these rows — low cardinality gives a handful of multi-child groups to
// expand/collapse, whereas `commodity` is nearly unique per row and would yield mostly singletons.
const groupedColumns = basicGridColumnConfig.slice(0, 9) as GridColDef[];

export const groupedGridRows = gridData.slice(0, 20);

export const GroupedDataGridPremium: React.FunctionComponent = () => {
  return (
    <Box sx={{ height: 600, minWidth: 900, width: '100%' }} data-testid='grouped-grid-premium'>
      <DataGridPremium
        columns={groupedColumns}
        rows={groupedGridRows}
        initialState={{
          columns: { columnVisibilityModel: { id: false } },
          rowGrouping: { model: ['status'] },
          aggregation: { model: { quantity: 'sum' } },
        }}
      />
    </Box>
  );
};

/**
 * DataGridPremium demonstrating the Premium row-grouping and aggregation features: rows are
 * grouped by `status` (groups start collapsed) with a `sum` aggregation on `quantity` shown in
 * the grand-total footer row.
 * @see https://mui.com/x/react-data-grid/row-grouping/
 */
export const groupedDataGridPremiumUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Grouped DataGridPremium',
  ui: <GroupedDataGridPremium />,
};
