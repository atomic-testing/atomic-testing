import {
  proportional,
  Table,
  TableColumn,
  useTableSelection,
  useTableSelectionState,
  useTableSortable,
  useTableSortableState,
} from '@astryxdesign/core/Table';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

type User = { id: string; name: string; role: string };

const users: User[] = [
  { id: '1', name: 'Alice', role: 'Admin' },
  { id: '2', name: 'Bob', role: 'User' },
  { id: '3', name: 'Carol', role: 'User' },
];

const userColumns: TableColumn<User>[] = [
  { key: 'name', header: 'Name', sortable: true, width: proportional(1) },
  { key: 'role', header: 'Role', sortable: true, width: proportional(1) },
];

type Product = { id: string; sku: string; price: string };

const products: Product[] = [
  { id: 'p1', sku: 'A-1', price: '$10.00' },
  { id: 'p2', sku: 'B-2', price: '$20.00' },
];

const productColumns: TableColumn<Product>[] = [
  { key: 'sku', header: 'SKU', width: proportional(1) },
  { key: 'price', header: 'Price', width: proportional(1) },
];

/**
 * A sortable + selectable table. Default-sorted ascending by name and with Bob
 * (id `2`) pre-selected, so the driver can read `aria-sort`, `aria-selected`, and
 * the partial select-all (`aria-checked="mixed"`) states.
 */
const UsersTable = () => {
  const { sortedData, sortConfig } = useTableSortableState<User>({
    data: users,
    defaultSort: [{ sortKey: 'name', direction: 'ascending' }],
  });
  const sortPlugin = useTableSortable<User>(sortConfig);
  const [selected, setSelected] = useState<Set<string>>(new Set(['2']));
  const { selectionConfig } = useTableSelectionState<User>({
    data: sortedData,
    idKey: 'id',
    selectedKeys: selected,
    setSelectedKeys: setSelected,
  });
  const selectionPlugin = useTableSelection<User>(selectionConfig);

  return (
    <div data-testid='users'>
      <Table data={sortedData} columns={userColumns} plugins={{ sortable: sortPlugin, selection: selectionPlugin }} />
    </div>
  );
};

/**
 * Astryx Table scene.
 *
 * `Table` does not forward `data-testid` to the `<table>`, so each table is wrapped
 * in a `<div data-testid>` the driver anchors on. The second, plain table verifies
 * selector scoping across instances.
 */
export const TableExample = () => (
  <>
    <UsersTable />
    <div data-testid='products'>
      <Table data={products} columns={productColumns} />
    </div>
  </>
);

export const tableUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Table',
  ui: <TableExample />,
};
