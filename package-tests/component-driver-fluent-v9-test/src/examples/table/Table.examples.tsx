import { IExampleUIUnit } from '@atomic-testing/core';
import {
  FluentProvider,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX, useState } from 'react';

interface Person {
  name: string;
  age: number;
  city: string;
}

const peopleRows: Person[] = [
  { name: 'Carol', age: 35, city: 'Chicago' },
  { name: 'Alice', age: 30, city: 'New York' },
  { name: 'Bob', age: 25, city: 'Los Angeles' },
];

type SortableColumn = 'name' | 'age';
type SortDirection = 'ascending' | 'descending';

/**
 * Plain `Table`'s presentational primitives ship NO built-in sort
 * orchestration (see `TableHeaderRowDriver`'s doc) — a consumer wires
 * `sortable`/`sortDirection`/`onClick` and the actual row-reordering
 * manually. This minimal local-state sort (toggling ascending/descending on
 * whichever of `name`/`age` was last clicked) exists purely so the suite has
 * a REAL, non-vacuous interaction to drive: `sortByColumn` should visibly
 * change `aria-sort` and reorder the rendered rows, not just report success
 * against an inert `aria-sort` attribute.
 */
function usePeopleSort(): {
  rows: Person[];
  sortColumn: SortableColumn | null;
  sortDirection: SortDirection;
  toggleSort: (column: SortableColumn) => void;
} {
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending');

  const toggleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(direction => (direction === 'ascending' ? 'descending' : 'ascending'));
    } else {
      setSortColumn(column);
      setSortDirection('ascending');
    }
  };

  const rows = [...peopleRows];
  if (sortColumn != null) {
    const mod = sortDirection === 'ascending' ? 1 : -1;
    rows.sort((a, b) => (a[sortColumn] < b[sortColumn] ? -1 : a[sortColumn] > b[sortColumn] ? 1 : 0) * mod);
  }

  return { rows, sortColumn, sortDirection, toggleSort };
}

interface Product {
  product: string;
  price: string;
}

const productRows: Product[] = [
  { product: 'Widget', price: '$10' },
  { product: 'Gadget', price: '$20' },
];

/**
 * Two `Table`s with deliberately different column/sort configuration so a
 * too-broadly-scoped locator in `TableDriver` would be caught immediately
 * (same disambiguation-testing convention as `Accordion.examples.tsx`'s two
 * accordions). Table A is `sortable` on `Name`/`Age` (with `City` opted OUT
 * via `sortable={false}`, exercising the "not sortable at all" `aria-sort`-
 * absent case) and reorders its rows through the local sort state above;
 * Table B carries no `sortable` prop anywhere, so every header cell should
 * report no sort affordance at all.
 */
const TableExample = () => {
  const { rows, sortColumn, sortDirection, toggleSort } = usePeopleSort();

  return (
    <FluentProvider theme={webLightTheme}>
      <Table data-testid='table-a' sortable>
        <TableHeader>
          <TableRow>
            <TableHeaderCell
              sortDirection={sortColumn === 'name' ? sortDirection : undefined}
              onClick={() => toggleSort('name')}>
              Name
            </TableHeaderCell>
            <TableHeaderCell
              sortDirection={sortColumn === 'age' ? sortDirection : undefined}
              onClick={() => toggleSort('age')}>
              Age
            </TableHeaderCell>
            <TableHeaderCell sortable={false}>City</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(person => (
            <TableRow key={person.name}>
              <TableCell>{person.name}</TableCell>
              <TableCell>
                <TableCellLayout>{person.age}</TableCellLayout>
              </TableCell>
              <TableCell>{person.city}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Table data-testid='table-b'>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Product</TableHeaderCell>
            <TableHeaderCell>Price</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productRows.map(item => (
            <TableRow key={item.product}>
              <TableCell>{item.product}</TableCell>
              <TableCell>{item.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FluentProvider>
  );
};

export const tableUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Table',
  ui: <TableExample />,
};
