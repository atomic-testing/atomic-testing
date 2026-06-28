# Module group: MUI-X component drivers (v5 / v6 / v7 / v8)

Drivers for Material-UI X components (DataGrid, and Date/Time Pickers), one package per MUI-X major:

| Package                                     | DataGrid | Date/Time pickers                                                                               |
| ------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `@atomic-testing/component-driver-mui-x-v5` | ✅       | ✅ ([datepicker/](../../packages/component-driver-mui-x-v5/src/components/datepicker/index.ts)) |
| `@atomic-testing/component-driver-mui-x-v6` | ✅       | —                                                                                               |
| `@atomic-testing/component-driver-mui-x-v7` | ✅       | —                                                                                               |
| `@atomic-testing/component-driver-mui-x-v8` | ✅       | —                                                                                               |

> Only **v5** ships datepicker drivers; v6–v8 are DataGrid-only ([v5/index.ts](../../packages/component-driver-mui-x-v5/src/index.ts) re-exports both `datagrid` and `datepicker`; [v8/index.ts](../../packages/component-driver-mui-x-v8/src/index.ts) re-exports only `datagrid`). [inferred] datepicker drivers were not carried forward past v5.

## Public surface

DataGrid (all versions) — barrel `components/datagrid/index.ts`, e.g. [v8](../../packages/component-driver-mui-x-v8/src/components/datagrid/index.ts):

- `DataGridProDriver` — the grid driver
- `DataGridDataRowDriver` — a data row
- `DataGridHeaderRowDriver` — the header row
- `DataGridCellQuery` — cell-location query helper (by row + column index/field)

Date/Time pickers (v5 only) — [datepicker/index.ts](../../packages/component-driver-mui-x-v5/src/components/datepicker/index.ts): `DateRangePickerDriver`, `DateTimePickerDriver`, `DesktopDatePickerDriver`, `MobileDatePickerDriver`, `MobileDatePickerDialogDriver`, `TimePickerDriver`, plus a `dateUtil` namespace and shared `types`.

## Responsibilities

- Drive virtualized/complex MUI-X widgets (grids render only visible rows; cells are located positionally).
- Provide column/row/cell read helpers over the DataGrid DOM.

## Non-goals

- No grid data modeling — test data comes from the fixture package (below).
- Pickers are v5-only; do not assume them in v6+.

## How it works

`DataGridProDriver extends ComponentDriver` with header-row and loading parts; it exposes `isLoading`/`waitForLoad`, `getColumnCount`/`getHeaderText`, `getRowCount`/`getRow`/`getRowText`, and `getCell`/`getCellText`, locating cells via `DataGridCellQuery` and iterating visible rows with `listHelper` (handles virtualization). [inferred from cross-version structure; confirm exact methods in the target version's `DataGridProDriver.ts`.]

## Test fixture — `@atomic-testing/internal-mui-x-test-fixture`

Shared grid config + data for DataGrid driver tests/examples ([src/index.ts](../../packages/internal-mui-x-test-fixture/src/index.ts) re-exports `gridConfig` + `gridData`):

- `gridConfig` — `initialState` (column visibility) and `basicGridColumnConfig` (field, headerName, type, valueOptions, width, editable) ([gridConfig.ts](../../packages/internal-mui-x-test-fixture/src/gridConfig.ts)).
- `gridData` — a commodity-trading dataset (desk, commodity, trader, quantity, status, prices, dates, broker, counterparty, etc.) ([gridData.ts](../../packages/internal-mui-x-test-fixture/src/gridData.ts)).

This is a workspace-private dev dependency, not a published consumer API.

## Invariants & failure modes

- DataGrid is virtualized: only rendered rows are queryable; scroll/paginate before asserting off-screen rows.
- Picker drivers exist only in v5 — referencing them from v6+ will not resolve.

## Extension points

- **Port DataGrid to a new MUI-X major** → copy the `datagrid/` folder, adjust selectors/classes for the new grid DOM, re-export from the package `index.ts`.
- **New cell/row helper** → add to `DataGridProDriver`/`DataGridDataRowDriver` and reuse `DataGridCellQuery`.

## Related files

- [v8 datagrid barrel](../../packages/component-driver-mui-x-v8/src/components/datagrid/index.ts)
- [v5 datepicker barrel](../../packages/component-driver-mui-x-v5/src/components/datepicker/index.ts)
- [internal-mui-x-test-fixture](../../packages/internal-mui-x-test-fixture/src/index.ts)
- [modules/component-driver-mui.md](component-driver-mui.md) — sibling MUI-core drivers; same version-split rationale ([ADR-003](../adr/003-version-specific-packages.md)).
