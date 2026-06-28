import { IExampleUIUnit } from '@atomic-testing/core';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import React from 'react';

//#region Basic Table
interface Dessert {
  name: string;
  calories: number;
  fat: number;
}

const baseRows: Dessert[] = [
  { name: 'Frozen yoghurt', calories: 159, fat: 6 },
  { name: 'Ice cream sandwich', calories: 237, fat: 9 },
  { name: 'Eclair', calories: 262, fat: 16 },
];

export const BasicTableExample = () => {
  // Sort by the "Dessert" (name) column so the driver can drive/read sort state.
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');

  const rows = React.useMemo(
    () => [...baseRows].sort((a, b) => (order === 'asc' ? 1 : -1) * a.name.localeCompare(b.name)),
    [order]
  );

  const toggleOrder = () => setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));

  return (
    <TableContainer component={Paper}>
      <Table data-testid='dessert-table' aria-label='dessert table'>
        <TableHead>
          <TableRow>
            <TableCell sortDirection={order}>
              <TableSortLabel active direction={order} onClick={toggleOrder}>
                Dessert
              </TableSortLabel>
            </TableCell>
            <TableCell align='right'>Calories</TableCell>
            <TableCell align='right'>Fat (g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell align='right'>{row.calories}</TableCell>
              <TableCell align='right'>{row.fat}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

/**
 * Basic table example adapted from the MUI website, with a sortable first column.
 * @see https://mui.com/material-ui/react-table/
 */
export const basicTableUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Basic Table',
  ui: <BasicTableExample />,
};
//#endregion
