import { IExampleUIUnit } from '@atomic-testing/core';
import { basicGridColumnConfig, gridData } from '@atomic-testing/internal-mui-x-test-fixture';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGridPremium, GridColDef, GridRowParams } from '@mui/x-data-grid-premium';
import React, { JSX, useCallback } from 'react';

const masterDetailColumns = basicGridColumnConfig.slice(0, 5) as GridColDef[];

export const masterDetailGridRows = gridData.slice(0, 15);
type MasterDetailGridRow = (typeof masterDetailGridRows)[number];

// Row index 2 deliberately has no detail content, so its toggle renders disabled — the fixture
// for testing that expandRowDetail throws rather than expanding an empty panel.
export const noDetailRowIndex = 2;
const noDetailRowId = masterDetailGridRows[noDetailRowIndex].id;

const getDetailPanelContent = ({ row }: GridRowParams<MasterDetailGridRow>) => {
  if (row.id === noDetailRowId) {
    return null;
  }
  return (
    <Box data-testid={`detail-panel-content-${row.id}`} sx={{ p: 2 }}>
      <Typography>Trader email: {row.traderEmail}</Typography>
    </Box>
  );
};

export const MasterDetailDataGridPremium: React.FunctionComponent = () => {
  const getDetailPanelHeight = useCallback(() => 100, []);
  return (
    <Box sx={{ height: 480, minWidth: 900, width: '100%' }} data-testid='master-detail-grid-premium'>
      <DataGridPremium
        columns={masterDetailColumns}
        rows={masterDetailGridRows}
        getDetailPanelContent={getDetailPanelContent}
        getDetailPanelHeight={getDetailPanelHeight}
        initialState={{ columns: { columnVisibilityModel: { id: false } } }}
      />
    </Box>
  );
};

/**
 * DataGridPremium demonstrating the Pro master-detail feature: every row can expand to reveal a
 * detail panel below it via `getDetailPanelContent`.
 * @see https://mui.com/x/react-data-grid/master-detail/
 */
export const masterDetailDataGridPremiumUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Master-Detail DataGridPremium',
  ui: <MasterDetailDataGridPremium />,
};
