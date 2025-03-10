export interface CellQueryByColumnIndex {
  rowIndex: number;
  columnIndex: number;
}

export interface CellQueryByColumnField {
  rowIndex: number;
  columnField: string;
}

export type DataGridCellQuery = CellQueryByColumnIndex | CellQueryByColumnField;
