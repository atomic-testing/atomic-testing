import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  listHelper,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

// MUI X v9 charts render an `aria-hidden` SVG surface plus an HTML legend. The SVG marks carry
// `Mui<Chart>Chart-*` classes and `data-series`/`data-index` hooks; the charts' accessibility
// layer is a set of hidden voiceover nodes for screen readers only, so the class hooks remain
// the structural handles (verified against @mui/x-charts 9.7 — see #904).
//
// Charts are e2e-primary: structural reads (legend, axis labels, data-point counts) work in both
// jsdom (with the chart shims in the test package's jest setup) and real browsers, while anything
// geometric — hover targets resolving to a tooltip, mark positions — needs a real layout engine
// and is only meaningful e2e.

const legendItemLocator = byCssSelector('.MuiChartsLegend-root .MuiChartsLegend-item');

// The tooltip is portaled to <body>; only one chart tooltip is open at a time.
const tooltipLocator = byCssSelector('.MuiChartsTooltip-root', 'Root');

function axisTickContainerLocator(axis: 'x' | 'y'): PartLocator {
  return byCssSelector(`.MuiChartsAxis-direction${axis.toUpperCase()} .MuiChartsAxis-tickContainer`);
}

/**
 * Base driver for the `@mui/x-charts` v9 chart family. Concrete drivers only differ in how a
 * chart type marks its data points in the SVG surface.
 */
export abstract class ChartDriverBase extends ComponentDriver {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, option);
  }

  /**
   * CSS (relative to the chart root) selecting one series' data-point marks, without an index.
   */
  protected abstract seriesDataPointsSelector(seriesIndex: number): string;

  /**
   * CSS (relative to the chart root) selecting a single data-point mark.
   */
  protected abstract dataPointSelector(seriesIndex: number, dataIndex: number): string;

  /**
   * The legend's item labels, in render order — one per series (or per slice for pie charts).
   */
  async getLegendItems(): Promise<string[]> {
    const labels: string[] = [];
    for await (const item of listHelper.getListItemIterator(
      this,
      locatorUtil.append(this.locator, legendItemLocator),
      HTMLElementDriver
    )) {
      const text = await item.getText();
      labels.push((text ?? '').trim());
    }
    return labels;
  }

  /**
   * The series labels as shown in the legend. Charts expose series names nowhere else in
   * portable DOM, so this reads the same items as {@link getLegendItems}.
   */
  async getSeriesLabels(): Promise<string[]> {
    return this.getLegendItems();
  }

  /**
   * The tick labels of the given axis, in render order. Unlabeled ticks are skipped — band
   * scales render an extra edge tick that carries no label.
   *
   * @param axis Which axis to read; defaults to `'x'`.
   */
  async getAxisLabels(axis: 'x' | 'y' = 'x'): Promise<string[]> {
    const labels: string[] = [];
    for await (const tick of listHelper.getListItemIterator(
      this,
      locatorUtil.append(this.locator, axisTickContainerLocator(axis)),
      HTMLElementDriver
    )) {
      const text = ((await tick.getText()) ?? '').trim();
      if (text.length > 0) {
        labels.push(text);
      }
    }
    return labels;
  }

  /**
   * The number of data-point marks a series renders (bars, line marks, or pie slices).
   *
   * @param seriesIndex The series to count; defaults to the first series.
   */
  async getDataPointCount(seriesIndex: number = 0): Promise<number> {
    return listHelper.getListItemCount(
      this,
      locatorUtil.append(this.locator, byCssSelector(this.seriesDataPointsSelector(seriesIndex)))
    );
  }

  /**
   * Hover the pointer over a data-point mark, e.g. to raise the chart tooltip.
   *
   * jsdom has no layout engine, so no tooltip geometry exists there — the hover dispatches but
   * tooltip assertions are E2E-only.
   *
   * @param dataIndex The data point's index within its series.
   * @param seriesIndex The series holding the point; defaults to the first series.
   */
  async hoverDataPoint(dataIndex: number, seriesIndex: number = 0): Promise<void> {
    const pointLocator = locatorUtil.append(
      this.locator,
      byCssSelector(this.dataPointSelector(seriesIndex, dataIndex))
    );
    if (!(await this.interactor.exists(pointLocator))) {
      throw new Error(`${this.driverName}: no data point at series ${seriesIndex}, index ${dataIndex}`);
    }
    await this.interactor.hover(pointLocator);
  }

  /**
   * The chart tooltip's text, or `undefined` while no tooltip is shown. Raise it first with
   * {@link hoverDataPoint} (E2E-only — see its jsdom caveat).
   */
  async getTooltipText(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(tooltipLocator))) {
      return undefined;
    }
    const text = await this.interactor.getText(tooltipLocator);
    return text ?? undefined;
  }
}
