import { childListHelper, ComponentDriver, ComponentDriverCtor } from '@atomic-testing/core';

/**
 * Shared cell-iteration surface for the Fluent v9 `DataGrid` row family —
 * {@link DataGridRowDriver} (data rows, `DataGridCell` children) and
 * {@link DataGridHeaderRowDriver} (the header row, `DataGridHeaderCell`
 * children) — mirroring `component-driver-mui-x-v9`'s
 * `DataGridRowDriverBase`/`getCellLocator()` SHAPE, but built on
 * `childListHelper` instead of plain `:nth-of-type` addressing.
 *
 * **Why not a `ListComponentDriver` (or MUI-X's fixed-offset trick), unlike
 * the plain-`Table` row family above**: DOM audit
 * (`@fluentui/react-table@9.19.17`, rendered snapshot of `<DataGrid
 * selectionMode="multiselect">`) shows `DataGridRow` renders its OPTIONAL
 * `DataGridSelectionCell` as the FIRST child whenever the grid's
 * `selectionMode` is set (`useDataGridRow_unstable`'s `selectionCell` slot,
 * `renderByDefault: selectable`) — and that cell shares its parent `<div>`
 * tag with every real cell. `:nth-of-type` addressing (what
 * `ListComponentDriver`/`listHelper` use) counts by TAG POSITION among ALL
 * siblings, not by class match, so a leading non-matching sibling shifts
 * every subsequent index by one — confirmed empirically:
 * `.fui-DataGridCell:nth-of-type(1)` matches nothing when a selection cell is
 * present (position 1 is the selection cell, which lacks that class), while
 * the first REAL cell only matches at `:nth-of-type(2)`.
 * `component-driver-mui-x-v9`'s `DataGridRowDriverBase` has an analogous
 * leading offset div, but copes with a FIXED `columnStartingIndex = 1`
 * constant because MUI-X renders that div UNCONDITIONALLY. Fluent's
 * selection cell is only rendered when `selectionMode` is set — a fixed
 * offset would be WRONG for a non-selectable grid (it would skip the actual
 * first cell) — so this base instead uses `childListHelper`'s `:nth-child` +
 * class/role-filter walk (the same technique `BreadcrumbDriver` uses for its
 * own mixed item/divider `<li>` siblings), which correctly skips a
 * present-or-absent leading selection cell without needing to know
 * statically whether one exists.
 */
export abstract class DataGridRowDriverBase<ItemT extends ComponentDriver> extends ComponentDriver<{}> {
  /** The CSS selector fragment (class or attribute selector) matching this row's real cells, excluding any selection cell. */
  protected abstract getCellSelector(): string;

  /** The driver class to instantiate for each matched cell. */
  protected abstract getCellClass(): ComponentDriverCtor<ItemT>;

  /** The number of cells in the row (excluding any selection cell). */
  async getCellCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, this.getCellSelector());
  }

  /** The cell driver at the given zero-based column index, or `null` when out of range. */
  async getCell(index: number): Promise<ItemT | null> {
    let position = 0;
    for await (const cell of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      this.getCellSelector(),
      this.getCellClass()
    )) {
      if (position === index) {
        return cell;
      }
      position++;
    }
    return null;
  }

  /** The text of every cell, in column order. */
  async getCellTexts(): Promise<string[]> {
    const texts: string[] = [];
    for await (const cell of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      this.getCellSelector(),
      this.getCellClass()
    )) {
      texts.push((await cell.getText())?.trim() ?? '');
    }
    return texts;
  }
}
