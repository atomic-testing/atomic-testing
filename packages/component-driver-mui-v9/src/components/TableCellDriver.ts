import { ComponentDriver } from '@atomic-testing/core';

/**
 * Driver for a single Material UI v9 TableCell (`<td>`/`<th>`, `.MuiTableCell-root`).
 *
 * A cell's content is plain text, so it relies on the inherited `getText()`/`exists()`;
 * it exists as a distinct type so {@link TableRowDriver} can expose typed cell drivers.
 * @see https://mui.com/material-ui/react-table/
 */
export class TableCellDriver extends ComponentDriver {
  get driverName(): string {
    return 'MuiV9TableCellDriver';
  }
}
