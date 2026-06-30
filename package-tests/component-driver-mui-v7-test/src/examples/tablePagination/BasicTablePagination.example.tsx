import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import React from 'react';

//#region Basic TablePagination
const ControlledTablePagination = (props: {
  testId: string;
  count: number;
  initialRowsPerPage: number;
  initialPage: number;
  rowsPerPageOptions?: Array<number | { value: number; label: string }>;
}) => {
  const [page, setPage] = React.useState(props.initialPage);
  const [rowsPerPage, setRowsPerPage] = React.useState(props.initialRowsPerPage);

  return (
    <TablePagination
      component='div'
      data-testid={props.testId}
      count={props.count}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={props.rowsPerPageOptions ?? [5, 10, 25]}
      onPageChange={(_e, next: number) => setPage(next)}
      onRowsPerPageChange={e => {
        setRowsPerPage(Number.parseInt(e.target.value, 10));
        setPage(0);
      }}
    />
  );
};

export const BasicTablePaginationExample = () => {
  // Two instances verify per-root scoping: `alpha` sits on the first page (prev
  // disabled) while `beta` is mid-range (both controls enabled). `gamma` selects
  // MUI's "All" option, whose real value is `-1` — distinct from a read failure,
  // which getRowsPerPage reports as `undefined`.
  return (
    <Box>
      <ControlledTablePagination testId='alpha-table-pagination' count={13} initialRowsPerPage={5} initialPage={0} />
      <ControlledTablePagination testId='beta-table-pagination' count={42} initialRowsPerPage={10} initialPage={1} />
      <ControlledTablePagination
        testId='gamma-table-pagination'
        count={13}
        initialRowsPerPage={-1}
        initialPage={0}
        rowsPerPageOptions={[5, { value: -1, label: 'All' }]}
      />
    </Box>
  );
};

/**
 * Basic table pagination example adapted from the MUI website.
 * @see https://mui.com/material-ui/react-table/#custom-pagination-options
 */
export const basicTablePaginationUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic TablePagination',
  ui: <BasicTablePaginationExample />,
};
//#endregion
