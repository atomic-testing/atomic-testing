import { ComponentDriver, ListComponentDriver } from '@atomic-testing/core';

/**
 * Shared cell-iteration surface for the Fluent v9 plain-`Table` row family —
 * {@link TableRowDriver} (body rows, `TableCell` children) and
 * {@link TableHeaderRowDriver} (the header row, `TableHeaderCell` children).
 *
 * Both row kinds are a homogeneous, same-tag `ListComponentDriver` over their
 * respective cell type (`<td class="fui-TableCell">` siblings under a body
 * row, `<th class="fui-TableHeaderCell">` siblings under the header row —
 * DOM audit, `@fluentui/react-table@9.19.17`: a row never mixes the two cell
 * kinds as siblings, so `ListComponentDriver`'s `:nth-of-type` addressing is
 * safe for both, unlike the DataGrid row family below, which has to reckon
 * with a conditionally-rendered selection cell — see
 * {@link DataGridRowDriverBase}). Each subclass fixes its own item
 * class/locator via its own constructor (mirroring `TableRowDriver`'s MUI
 * counterpart); this base only supplies the three read methods every row
 * needs regardless of cell kind.
 */
export abstract class TableRowDriverBase<ItemT extends ComponentDriver> extends ListComponentDriver<ItemT> {
  /** The number of cells in the row. */
  async getCellCount(): Promise<number> {
    return this.getItemCount();
  }

  /** The cell driver at the given zero-based column index, or `null` when out of range. */
  async getCell(index: number): Promise<ItemT | null> {
    return this.getItemByIndex(index);
  }

  /** The text of every cell, in column order. */
  async getCellTexts(): Promise<string[]> {
    const cells = await this.getItems();
    const texts: string[] = [];
    for (const cell of cells) {
      texts.push((await cell.getText())?.trim() ?? '');
    }
    return texts;
  }
}
