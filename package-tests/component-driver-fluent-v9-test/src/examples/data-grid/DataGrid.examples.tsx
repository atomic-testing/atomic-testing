import { IExampleUIUnit } from '@atomic-testing/core';
import {
  Button,
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  FluentProvider,
  TableCellActions,
  TableColumnDefinition,
  useDataGridContext_unstable,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX, useState } from 'react';

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

/**
 * Fluent's `columnSizing_unstable.enableKeyboardMode` (the entry point into
 * `DataGridHeaderCellDriver`'s keyboard-accessible resize) has NO default UI
 * trigger of its own — Fluent's own Storybook wires it via a consumer-added
 * right-click context menu. This example uses the simplest faithful
 * equivalent: one button per header cell, so the suite can drive entry
 * without depending on a `Menu`'s open/close behavior across jsdom and three
 * Playwright engines.
 */
// No visible text: it lives inside the header cell alongside the column
// label, and `DataGridHeaderCellDriver`/`DataGridDriver`'s text reads (e.g.
// `getHeaderTexts`) read the cell's full text content — a labeled button
// here would leak into that reading, the same reason Fluent's own
// `TableCellActions` spec example uses an icon-only `Button` rather than one
// with visible children.
const KeyboardResizeTrigger = ({ columnId }: { columnId: string }) => {
  const enableKeyboardMode = useDataGridContext_unstable(ctx => ctx.columnSizing_unstable.enableKeyboardMode);
  return (
    <button
      type='button'
      aria-label={`Resize ${columnId} with keyboard`}
      data-testid={`kb-resize-trigger-${columnId}`}
      onClick={enableKeyboardMode(columnId)}
    />
  );
};

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
 * and `resizableColumns` (a real drag handle on every non-last column, plus a
 * per-column `KeyboardResizeTrigger` button standing in for whatever entry
 * point a real app wires to `enableKeyboardMode` — see that component's doc).
 * Grid B is deliberately simpler — `selectionMode="single"` and no
 * sorting/resize — so the suite can verify single-select's real-radio
 * semantics (no "select all") without Grid A's extra surface leaking in, and,
 * since it renders no `TableCellActions` anywhere, doubles as the "absent"
 * case for `DataGridCellDriver.getActionButtons`/`isActionsVisible`.
 *
 * Grid A's `name` column additionally wires a `TableCellActions` the same way
 * `Table.examples.tsx` does — `visible` driven from row-level
 * `onMouseEnter`/`onMouseLeave`/`onFocus`/`onBlur` state (see that file's doc
 * for why hover-only CSS isn't an option here).
 */
const DataGridExample = () => {
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const clearActiveRow = (rowId: string) => setActiveRow(current => (current === rowId ? null : current));

  return (
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
            {({ renderHeaderCell, columnId }) => (
              <DataGridHeaderCell>
                {renderHeaderCell()}
                <KeyboardResizeTrigger columnId={columnId as string} />
              </DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<Person>>
          {({ item, rowId }) => (
            <DataGridRow<Person>
              key={rowId}
              onMouseEnter={() => setActiveRow(rowId as string)}
              onMouseLeave={() => clearActiveRow(rowId as string)}
              onFocus={() => setActiveRow(rowId as string)}
              onBlur={() => clearActiveRow(rowId as string)}>
              {({ renderCell, columnId }) => (
                <DataGridCell>
                  {renderCell(item)}
                  {columnId === 'name' && (
                    <TableCellActions visible={activeRow === rowId}>
                      {/* No visible text — see `KeyboardResizeTrigger`'s comment on why (leaks into `getCellText`). */}
                      <Button aria-label='Edit' data-testid={`row-action-${rowId}`} size='small' />
                    </TableCellActions>
                  )}
                </DataGridCell>
              )}
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
};

export const dataGridUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent DataGrid',
  ui: <DataGridExample />,
};
