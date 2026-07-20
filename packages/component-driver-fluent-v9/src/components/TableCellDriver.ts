import { ComponentDriver } from '@atomic-testing/core';

/**
 * Driver for a single Fluent v9 `TableCell` — a data cell in a plain `Table`'s
 * body (see {@link TableRowDriver}; the header's own `TableHeaderCell` is
 * modeled separately by {@link TableHeaderCellDriver} — see that class's doc
 * for why the two are NOT the same driver, unlike `component-driver-mui-v9`'s
 * single `TableCellDriver`).
 *
 * DOM audit (`@fluentui/react-table@9.19.17`, re-exported from
 * `@fluentui/react-components@9.74.3`): by default `Table` renders its
 * subtree with real NATIVE elements (`useTable_unstable`'s `rootComponent`
 * is `'table'`/`'tbody'`/`'tr'`/`'td'`/`'th'` unless the consumer opts into
 * `noNativeElements`/`as`) — `TableCell` renders a plain
 * `<td class="fui-TableCell">` with **no `role` attribute at all** (native
 * `<td>` semantics apply implicitly); verified via a rendered
 * `ReactDOMServer.renderToStaticMarkup` snapshot of a `Table`/`TableBody`/
 * `TableRow`/`TableCell` composition. A cell's content is plain text (often
 * wrapped in `TableCellLayout` for icon+text layout, which contributes no
 * extra text nodes of its own), so this driver relies entirely on the
 * inherited `getText()`/`exists()` — it exists as a distinct type purely so
 * {@link TableRowDriver} can expose typed cell drivers, mirroring
 * `component-driver-mui-v9`'s `TableCellDriver`.
 * @see https://react.fluentui.dev/?path=/docs/components-table--docs
 */
export class TableCellDriver extends ComponentDriver<{}> {
  override get driverName(): string {
    return 'FluentV9TableCellDriver';
  }
}
