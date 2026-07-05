import { ChartDriverBase } from './ChartDriverBase';

/**
 * Driver for the MUI X v9 ScatterChart.
 *
 * Points render as `circle.MuiScatterChart-marker` siblings inside one `g.MuiScatterChart-series`
 * group per series (groups in series order); markers carry no index attribute, so both series and
 * marker are addressed positionally. The legend's own swatch (`circle.MuiChartsLabelMark-fill`)
 * lives outside the series groups, so scoping the selector to `.MuiScatterChart-series` keeps it
 * out of the data-point count.
 * @see https://mui.com/x/react-charts/scatter/
 */
export class ScatterChartDriver extends ChartDriverBase {
  protected seriesDataPointsSelector(seriesIndex: number): string {
    return `.MuiScatterChart-series:nth-of-type(${seriesIndex + 1}) circle.MuiScatterChart-marker`;
  }

  protected dataPointSelector(seriesIndex: number, dataIndex: number): string {
    return `${this.seriesDataPointsSelector(seriesIndex)}:nth-of-type(${dataIndex + 1})`;
  }

  get driverName(): string {
    return 'MuiV9ScatterChart';
  }
}
