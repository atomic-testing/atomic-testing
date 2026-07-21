import { byCssSelector, ComponentDriverCtor, IToggleDriver, locatorUtil, type PartLocator } from '@atomic-testing/core';

import { DataGridCellDriver } from './DataGridCellDriver';
import { DataGridRowDriverBase } from './DataGridRowDriverBase';

const dataCellSelector = '.fui-DataGridCell';
const selectionInputSelector: PartLocator = byCssSelector('.fui-DataGridSelectionCell input');
const selectionRadioInputSelector: PartLocator = byCssSelector('.fui-DataGridSelectionCell input[type="radio"]');

/**
 * Driver for a single Fluent v9 `DataGridRow` acting as a `DataGrid` DATA
 * row (see {@link DataGridDriver.getHeaderRow} for the header row, a
 * {@link DataGridHeaderRowDriver} instead).
 *
 * A {@link DataGridRowDriverBase} over the row's `DataGridCell` children,
 * addressed by `.fui-DataGridCell` (excluding the row's own optional
 * selection cell — see that base class's doc for why role
 * (`[role="gridcell"]`) is not a safe cell-item selector here).
 *
 * Implements {@link IToggleDriver} for row selection — DOM audit
 * (`@fluentui/react-table@9.19.17`, rendered snapshot of `<DataGrid
 * selectionMode="multiselect"|"single">`): a selectable row's root carries
 * `aria-selected="true"|"false"` (`useDataGridRow_unstable`: `'aria-selected':
 * selectable ? selected : undefined` — absent entirely when `selectionMode`
 * is unset), which {@link isSelected} reads directly. The row's leading
 * `DataGridSelectionCell` renders a REAL native `<input type="checkbox">`
 * (`selectionMode="multiselect"`) or `<input type="radio">`
 * (`selectionMode="single"`), verified in the rendered output — the same
 * real-native-input contract this package's `CheckboxDriver`/`RadioDriver`
 * already rely on — so {@link setSelected} clicks that input directly
 * (mirroring `component-driver-mui-x-v9`'s `DataGridPremiumDriver.selectRow`,
 * which does the same against `input[type="checkbox"]`).
 *
 * **`setSelected(false)` silently no-ops in single-select mode** — verified
 * against `@fluentui/react-utilities@9.26.5`'s `useSingleSelection.toggleItem`,
 * which ALWAYS resolves a click to "select this row" (`changeSelection(event,
 * new Set([itemId]))`) regardless of the row's current state: there is no
 * click path back to "nothing selected" in single-select mode, so clicking
 * the input would be a doomed, effect-free action. Deliberately a no-op
 * rather than a thrown error (unlike `RadioDriver.setSelected(false)`/
 * `TreeItemDriver.setSelected(false)`'s single-select case) so that
 * {@link DataGridDriver.deselectRow}'s own boolean-return, bulk-friendly
 * contract (mirroring `selectAllRows`/`deselectAllRows`) never has to
 * propagate an exception for an otherwise-valid row index.
 */
export class DataGridRowDriver extends DataGridRowDriverBase<DataGridCellDriver> implements IToggleDriver {
  protected override getCellSelector(): string {
    return dataCellSelector;
  }

  protected override getCellClass(): ComponentDriverCtor<DataGridCellDriver> {
    return DataGridCellDriver;
  }

  private get selectionInputLocator(): PartLocator {
    return locatorUtil.append(this.locator, selectionInputSelector);
  }

  /** Whether this row is selected, read from its own `aria-selected` (present only when the grid's `selectionMode` is set). */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-selected')) === 'true';
  }

  /**
   * Select or deselect this row by clicking its selection checkbox/radio
   * (no-op when already in the target state). Also a no-op for
   * `setSelected(false)` in single-select mode — see class doc.
   */
  async setSelected(selected: boolean): Promise<void> {
    if ((await this.isSelected()) === selected) {
      return;
    }
    if (!selected && (await this.isSingleSelectMode())) {
      return;
    }
    await this.interactor.click(this.selectionInputLocator);
  }

  private async isSingleSelectMode(): Promise<boolean> {
    return this.interactor.exists(locatorUtil.append(this.locator, selectionRadioInputSelector));
  }

  override get driverName(): string {
    return 'FluentV9DataGridRowDriver';
  }
}
