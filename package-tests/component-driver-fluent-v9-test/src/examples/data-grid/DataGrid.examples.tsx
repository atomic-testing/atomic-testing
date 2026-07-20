import { IExampleUIUnit } from '@atomic-testing/core';
import {
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  FluentProvider,
  TableColumnDefinition,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX } from 'react';

interface Person {
  id: string;
  name: string;
  age: number;
  city: string;
}

const peopleItems: Person[] = [
  { id: 'p1', name: 'Carol', age: 35, city: 'Chicago' },
  { id: 'p2', name: 'Alice', age: 30, city: 'New York' },
  { id: 'p3', name: 'Bob', age: 25, city: 'Los Angeles' },
];

// `city` carries no `compare`, so its column is NOT sortable — exercises the
// "not sortable at all" `aria-sort`-absent case, same as Table.examples.tsx's
// City column.
const peopleColumns: TableColumnDefinition<Person>[] = [
  createTableColumn<Person>({
    columnId: 'name',
    compare: (a, b) => a.name.localeCompare(b.name),
    renderHeaderCell: () => 'Name',
    renderCell: item => item.name,
  }),
  createTableColumn<Person>({
    columnId: 'age',
    compare: (a, b) => a.age - b.age,
    renderHeaderCell: () => 'Age',
    renderCell: item => item.age,
  }),
  createTableColumn<Person>({
    columnId: 'city',
    renderHeaderCell: () => 'City',
    renderCell: item => item.city,
  }),
];

interface Product {
  id: string;
  product: string;
  price: string;
}

const productItems: Product[] = [
  { id: 'w1', product: 'Widget', price: '$10' },
  { id: 'w2', product: 'Gadget', price: '$20' },
];

const productColumns: TableColumnDefinition<Product>[] = [
  createTableColumn<Product>({
    columnId: 'product',
    renderHeaderCell: () => 'Product',
    renderCell: item => item.product,
  }),
  createTableColumn<Product>({
    columnId: 'price',
    renderHeaderCell: () => 'Price',
    renderCell: item => item.price,
  }),
];

/**
 * Two `DataGrid`s with deliberately different config so a too-broadly-scoped
 * locator in `DataGridDriver` would be caught immediately (same
 * disambiguation-testing convention as `Accordion.examples.tsx`'s two
 * accordions). Grid A exercises the full built-in feature surface —
 * `sortable` (two sortable columns via `compare`, one non-sortable),
 * `selectionMode="multiselect"` (real "select all" + per-row checkboxes),
 * and `resizableColumns` (a real drag handle on every non-last column). Grid
 * B is deliberately simpler — `selectionMode="single"` and no
 * sorting/resize — so the suite can verify single-select's real-radio
 * semantics (no "select all") without Grid A's extra surface leaking in.
 */
const DataGridExample = () => (
  <FluentProvider theme={webLightTheme}>
    <DataGrid
      data-testid='data-grid-a'
      items={peopleItems}
      columns={peopleColumns}
      getRowId={item => item.id}
      sortable
      selectionMode='multiselect'
      resizableColumns>
      <DataGridHeader>
        <DataGridRow<Person>>
          {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Person>>
        {({ item, rowId }) => (
          <DataGridRow<Person> key={rowId}>
            {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>

    <DataGrid
      data-testid='data-grid-b'
      items={productItems}
      columns={productColumns}
      getRowId={item => item.id}
      selectionMode='single'>
      <DataGridHeader>
        <DataGridRow<Product>>
          {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Product>>
        {({ item, rowId }) => (
          <DataGridRow<Product> key={rowId}>
            {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  </FluentProvider>
);

export const dataGridUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent DataGrid',
  ui: <DataGridExample />,
};
